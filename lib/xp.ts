const XP_KEY = "pingpong-xp";

// 각 레벨에 도달하기 위한 누적 XP 임계값
const LEVEL_THRESHOLDS = [0, 50, 130, 250, 410, 620, 880, 1190, 1550, 1960, 2500];

const LEVEL_TITLES = [
  "", "Beginner", "Learner", "Speaker", "Talker",
  "Fluent", "Pro", "Expert", "Master", "Legend", "Champion",
];
const LEVEL_EMOJIS = [
  "", "🌱", "🌿", "🌸", "⭐", "🔥", "💎", "🏆", "👑", "🌟", "🚀",
];

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadTotalXP(): number {
  if (!isBrowser()) return 0;
  return Number(window.localStorage.getItem(XP_KEY) || "0");
}

export function getLevelFromXP(totalXP: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 1; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) return i;
  }
  return 1;
}

/** 현재 레벨 내 진행도 */
export function getXPProgress(totalXP: number): { current: number; needed: number; percent: number } {
  const level = getLevelFromXP(totalXP);
  const base = LEVEL_THRESHOLDS[level] ?? 0;
  const next = LEVEL_THRESHOLDS[level + 1] ?? base + 500;
  const current = totalXP - base;
  const needed = next - base;
  return { current, needed, percent: Math.round((current / needed) * 100) };
}

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[level] ?? "Champion";
}

export function getLevelEmoji(level: number): string {
  return LEVEL_EMOJIS[level] ?? "🚀";
}

/** XP 추가 후 결과 반환 */
export function addXP(amount: number): {
  totalXP: number;
  level: number;
  leveledUp: boolean;
  oldLevel: number;
} {
  if (!isBrowser()) return { totalXP: 0, level: 1, leveledUp: false, oldLevel: 1 };

  const current = loadTotalXP();
  const oldLevel = getLevelFromXP(current);
  const newTotal = current + amount;
  const newLevel = getLevelFromXP(newTotal);

  window.localStorage.setItem(XP_KEY, String(newTotal));

  return {
    totalXP: newTotal,
    level: newLevel,
    leveledUp: newLevel > oldLevel,
    oldLevel,
  };
}
