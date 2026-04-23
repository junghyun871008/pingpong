const REVIEW_KEY = "pingpong-review";

export function loadReview(): string[] {
  const raw = localStorage.getItem(REVIEW_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReview(items: string[]) {
  localStorage.setItem(REVIEW_KEY, JSON.stringify(items));
}