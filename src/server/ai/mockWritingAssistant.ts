import type { WritingAssistantInput, WritingAssistantResult, WritingAssistantTone } from "@/shared/types/writingAssistant";

const stopWords = new Set([
  "about",
  "after",
  "again",
  "also",
  "because",
  "before",
  "being",
  "could",
  "every",
  "from",
  "have",
  "just",
  "like",
  "into",
  "more",
  "that",
  "their",
  "there",
  "these",
  "this",
  "through",
  "with",
  "really",
  "very",
  "would",
  "your"
]);

function getWords(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 3 && !stopWords.has(word));
}

function getKeywords(input: WritingAssistantInput) {
  const counts = new Map<string, number>();
  getWords(`${input.title} ${input.category} ${input.tags} ${input.content}`).forEach((word) => {
    counts.set(word, (counts.get(word) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, 6);
}

function normalizeSentence(sentence: string) {
  const trimmed = sentence.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
}

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getTonePrefix(tone: WritingAssistantTone) {
  if (tone === "academic") return "An analysis of";
  if (tone === "creative") return "A fresh look at";
  if (tone === "casual") return "A simple take on";
  return "A practical guide to";
}

function getSummary(content: string, tone: WritingAssistantTone) {
  const sentences = content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (!sentences.length) {
    return "Write some content first to get suggestions.";
  }

  const selected = sentences.slice(0, 3).map(normalizeSentence).join(" ");

  if (tone === "academic") {
    return `This post examines ${selected.charAt(0).toLowerCase()}${selected.slice(1)}`.slice(0, 380);
  }

  if (tone === "casual") {
    return `A quick, reader-friendly summary: ${selected}`.slice(0, 380);
  }

  if (tone === "creative") {
    return `A concise snapshot of the idea: ${selected}`.slice(0, 380);
  }

  return selected.slice(0, 380);
}

function improveSentenceFlow(content: string, tone: WritingAssistantTone) {
  return content
    .replace(/\s+/g, " ")
    .replace(/\bi think\b/gi, tone === "academic" ? "this suggests" : "it seems")
    .replace(/\ba lot of\b/gi, "many")
    .replace(/\bvery important\b/gi, "important")
    .replace(/\breally good\b/gi, "effective")
    .replace(/\bthings\b/gi, "ideas")
    .split(/(?<=[.!?])\s+/)
    .map(normalizeSentence)
    .filter(Boolean)
    .join(" ");
}

function getImprovedText(content: string, tone: WritingAssistantTone) {
  if (!content.trim()) {
    return "Write some content first to get suggestions.";
  }

  const improved = improveSentenceFlow(content, tone);

  if (tone === "academic") {
    return improved.replace(/\bThis post\b/g, "This article").replace(/\bshows\b/g, "demonstrates");
  }

  if (tone === "casual") {
    return improved.replace(/\btherefore\b/gi, "so").replace(/\butilize\b/gi, "use");
  }

  if (tone === "creative") {
    return improved.replace(/\bimportant\b/gi, "meaningful").replace(/\beffective\b/gi, "thoughtful");
  }

  return improved;
}

export function runMockWritingAssistant(input: WritingAssistantInput): WritingAssistantResult {
  const keywords = getKeywords(input);
  const primary = keywords[0] || input.category || "writing";
  const secondary = keywords[1] || "ideas";
  const category = input.category || "Blog";
  const prefix = getTonePrefix(input.tone);
  const titleKeyword = toTitleCase(primary);
  const secondaryKeyword = toTitleCase(secondary);

  return {
    provider: "mock",
    titleSuggestions: [
      `${prefix} ${titleKeyword}`,
      `What ${secondaryKeyword} Teaches Us About ${titleKeyword}`,
      `${toTitleCase(category)} Notes: ${titleKeyword} in Practice`
    ],
    summary: getSummary(input.content, input.tone),
    tags: [...new Set([...keywords.slice(0, 5), ...(input.category ? [input.category.toLowerCase()] : [])])].slice(0, 6),
    improvedText: getImprovedText(input.content, input.tone)
  };
}
