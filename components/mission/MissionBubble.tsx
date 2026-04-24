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
        className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-md ring-1 ${
          isAI
            ? "bg-white text-slate-950 ring-slate-200"
            : "bg-blue-700 text-white ring-blue-800"
        }`}
      >
        <div className={`mb-1 text-xs font-black uppercase tracking-wide ${isAI ? "text-slate-700" : "text-blue-100"}`}>
          {isAI ? "AI" : "You"}
        </div>

        <div className="text-base font-black leading-7">
          {isAI ? turn.text : answer || <span className="text-blue-100">힌트: {turn.hint}</span>}
        </div>

        {isAI && turn.text && (
          <button
            onClick={() => speakEnglish(turn.text || "")}
            className="mt-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800"
          >
            🔊 다시 듣기
          </button>
        )}
      </div>
    </div>
  );
}