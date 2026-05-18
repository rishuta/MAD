export type WritingAssistantMode = "title" | "summary" | "tags" | "improve";
export type WritingAssistantTone = "professional" | "casual" | "academic" | "creative";

export type WritingAssistantInput = {
  mode: WritingAssistantMode;
  title: string;
  content: string;
  category: string;
  tags: string;
  tone: WritingAssistantTone;
};

export type WritingAssistantResult = {
  provider: "gemini" | "mock";
  titleSuggestions: string[];
  summary: string;
  tags: string[];
  improvedText: string;
  model?: string;
  fallback?: boolean;
  error?: string;
};
