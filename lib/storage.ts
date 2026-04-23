const REVIEW_KEY = "pingpong-review";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadReview(): string[] {
  if (!isBrowser()) return [];

  const raw = window.localStorage.getItem(REVIEW_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReview(items: string[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(REVIEW_KEY, JSON.stringify(items));
}