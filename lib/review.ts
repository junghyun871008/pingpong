import { loadReview, saveReview } from "@/lib/storage";

export function getMergedReview(items: string[]): string[] {
  const existing = loadReview();
  const merged = [...items, ...existing].filter(
    (item, index, arr) => arr.indexOf(item) === index
  );

  saveReview(merged.slice(0, 10));
  return merged.slice(0, 3);
}

export function getInitialReview(): string[] {
  const stored = loadReview();
  if (stored.length > 0) return stored.slice(0, 3);

  return ["I like coffee.", "I'm tired.", "I live in Busan."];
}