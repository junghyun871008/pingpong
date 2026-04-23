import type { Turn } from "@/types/mission";

type Props = {
  turn: Turn;
  answer?: string;
};

export default function MissionBubble({ turn, answer }: Props) {
  const isAI = turn.speaker === "AI";

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
          isAI ? "bg-white" : "bg-slate-900 text-white"
        }`}
      >
        <div className="mb-1 text-xs font-medium uppercase tracking-wide opacity-70">
          {isAI ? "AI" : "You"}
        </div>
        <div className="text-sm leading-6">
          {isAI ? turn.text : answer || <span className="opacity-60">힌트: {turn.hint}</span>}
        </div>
      </div>
    </div>
  );
}