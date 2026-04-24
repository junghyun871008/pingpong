import { getXPProgress, getLevelEmoji, getLevelTitle } from "@/lib/xp";

type Props = {
  totalXP: number;
  level: number;
};

export default function XPBar({ totalXP, level }: Props) {
  const { current, needed, percent } = getXPProgress(totalXP);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 ring-1 ring-blue-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getLevelEmoji(level)}</span>
          <div>
            <div className="text-xs font-black text-blue-800">Level {level}</div>
            <div className="text-base font-black text-slate-950">{getLevelTitle(level)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-600">총 XP</div>
          <div className="text-lg font-black text-blue-700">{totalXP.toLocaleString()}</div>
        </div>
      </div>

      {/* XP 진행 바 */}
      <div className="mt-3">
        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
          <span>다음 레벨까지</span>
          <span>{current} / {needed} XP</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-blue-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
