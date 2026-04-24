"use client";

import { getLevelEmoji, getLevelTitle } from "@/lib/xp";

type Props = {
  level: number;
  onClose: () => void;
};

export default function LevelUpModal({ level, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl animate-[popIn_0.35s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl">{getLevelEmoji(level)}</div>
        <div className="mt-4 text-sm font-black uppercase tracking-widest text-blue-600">
          레벨 업!
        </div>
        <div className="mt-2 text-4xl font-black text-slate-950">
          Level {level}
        </div>
        <div className="mt-1 text-xl font-bold text-slate-700">
          {getLevelTitle(level)}
        </div>
        <p className="mt-4 text-base font-medium text-slate-600">
          꾸준히 말하고 있어요! 오늘도 한 문장씩 계속해봐요. 💪
        </p>
        <button
          onClick={onClose}
          className="mt-6 h-14 w-full rounded-2xl bg-blue-600 text-lg font-black text-white shadow-md active:scale-95"
        >
          계속하기
        </button>
      </div>
    </div>
  );
}
