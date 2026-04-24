import type { Turn } from "@/types/mission";
import { speakEnglish } from "@/services/tts";

type Props = {
  turn: Turn;
  answer?: string;
};

export default function MissionBubble({ turn, answer }: Props) {
  const isAI = turn.speaker === "AI";

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
          isAI ? "bg-white text-slate-950" : "bg-green-500 text-white"
        }`}
      >
        <div className="mb-1 text-xs font-bold uppercase tracking-wide opacity-80">
          {isAI ? "AI" : "You"}
        </div>

        <div className="text-base font-semibold leading-7">
          {isAI ? turn.text : answer || <span className="opacity-80">힌트: {turn.hint}</span>}
        </div>

        {isAI && turn.text && (
          <button
            onClick={() => speakEnglish(turn.text || "")}
            className="mt-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
          >
            🔊 다시 듣기
          </button>
        )}
      </div>
    </div>
  );
}