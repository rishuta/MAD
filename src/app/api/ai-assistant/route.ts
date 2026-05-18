import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { runMockWritingAssistant } from "@/server/ai/mockWritingAssistant";
import type { WritingAssistantInput, WritingAssistantResult } from "@/shared/types/writingAssistant";

export const runtime = "nodejs";

type AssistantResponse = {
  ok: boolean;
  result: WritingAssistantResult;
};

const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite"] as const;
const TEMPORARY_ERROR_MESSAGE = "AI is busy right now, showing local suggestions.";
const UNAVAILABLE_ERROR_MESSAGE = "AI suggestions are unavailable right now, showing local suggestions.";

type GeminiModelName = (typeof GEMINI_MODELS)[number];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createFallback(input: WritingAssistantInput, error?: string): AssistantResponse {
  return {
    ok: true,
    result: {
      ...runMockWritingAssistant(input),
      fallback: true,
      error
    }
  };
}

function isTemporaryGeminiError(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const status = "status" in error ? (error as { status?: unknown }).status : undefined;
    if (status === 503 || status === 429 || status === 500 || status === 502 || status === 504) {
      return true;
    }
  }

  const message = error instanceof Error ? error.message : String(error);
  return /\b(429|500|502|503|504)\b|high demand|overloaded|temporar/i.test(message);
}

async function generateWithModel(apiKey: string, input: WritingAssistantInput, modelName: GeminiModelName) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7
    }
  });

  const response = await model.generateContent(buildPrompt(input));
  const text = response.response.text();

  if (!text.trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  const parsed = JSON.parse(cleanJson(text));
  const result = normalizeResult(parsed);

  if (!result) {
    throw new Error("Gemini returned an unexpected response shape.");
  }

  return {
    ...result,
    model: modelName
  };
}

async function generateWithGemini(apiKey: string, input: WritingAssistantInput) {
  let hadTemporaryError = false;

  for (const modelName of GEMINI_MODELS) {
    try {
      return await generateWithModel(apiKey, input, modelName);
    } catch (error) {
      if (isTemporaryGeminiError(error)) {
        hadTemporaryError = true;

        try {
          await wait(600);
          return await generateWithModel(apiKey, input, modelName);
        } catch (retryError) {
          if (isTemporaryGeminiError(retryError)) {
            hadTemporaryError = true;
          }
        }
      }
    }
  }

  throw new Error(hadTemporaryError ? TEMPORARY_ERROR_MESSAGE : UNAVAILABLE_ERROR_MESSAGE);
}

function cleanJson(text: string) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function normalizeResult(value: unknown): WritingAssistantResult | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const titleSuggestions = Array.isArray(record.titleSuggestions) ? record.titleSuggestions.filter((item): item is string => typeof item === "string").slice(0, 3) : [];
  const tags = Array.isArray(record.tags) ? record.tags.filter((item): item is string => typeof item === "string").slice(0, 5) : [];
  const summary = typeof record.summary === "string" ? record.summary : "";
  const improvedText = typeof record.improvedText === "string" ? record.improvedText : "";

  if (!titleSuggestions.length || !summary || !tags.length || !improvedText) {
    return null;
  }

  return {
    provider: "gemini",
    titleSuggestions,
    summary,
    tags,
    improvedText,
    fallback: false
  };
}

function buildPrompt(input: WritingAssistantInput) {
  return `
You are a helpful writing assistant for a clean blog platform.
Return ONLY valid JSON with this exact shape:
{
  "titleSuggestions": ["title 1", "title 2", "title 3"],
  "summary": "A short 2-3 line summary.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "improvedText": "A lightly improved version of the draft."
}

Rules:
- Tone: ${input.tone}
- Generate exactly 3 title suggestions.
- Generate exactly 5 concise lowercase tags.
- Summary must be 2-3 lines, professional, and not exaggerated.
- Improved text should lightly improve grammar, clarity, flow, and professionalism.
- Do not invent specific facts not present in the draft.
- Do not include markdown fences or explanations.

Draft title: ${input.title || "(none)"}
Category: ${input.category || "(none)"}
Existing tags: ${input.tags || "(none)"}
Draft content:
${input.content}
`;
}

export async function POST(request: Request) {
  const input = (await request.json()) as WritingAssistantInput;

  if (!input.content?.trim()) {
    return NextResponse.json(createFallback(input, "Write some content first to get suggestions."));
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(createFallback(input, "AI is not configured, showing local suggestions."));
  }

  try {
    const result = await generateWithGemini(apiKey, input);
    return NextResponse.json({ ok: true, result } satisfies AssistantResponse);
  } catch (error) {
    const message = error instanceof Error && error.message === TEMPORARY_ERROR_MESSAGE ? TEMPORARY_ERROR_MESSAGE : UNAVAILABLE_ERROR_MESSAGE;
    return NextResponse.json(createFallback(input, message));
  }
}
