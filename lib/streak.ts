const STREAK_KEY = "pingpong-streak";
const LAST_DATE_KEY = "pingpong-last-date";

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function loadStreak(): number {
  const raw = localStorage.getItem(STREAK_KEY);
  return raw ? Number(raw) : 0;
}

export function updateStreak(): number {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  const lastDate = localStorage.getItem(LAST_DATE_KEY);
  let streak = loadStreak();

  if (lastDate === today) return streak;

  if (lastDate === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }

  localStorage.setItem(STREAK_KEY, String(streak));
  localStorage.setItem(LAST_DATE_KEY, today);

  return streak;
}