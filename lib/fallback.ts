import { getCorrection } from "@/lib/correction";

export function getFallbackCorrection(input: string) {
  const fallback = getCorrection(input);

  return {
    corrected: fallback?.corrected ?? input,
    note: fallback?.note ?? "좋아요.",
    nextQuestion: "How are you today?",
  };
}