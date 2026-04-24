import type { CorrectionResult } from "@/lib/correction";
import { speakEnglish } from "@/services/tts";

type Props = {
  correction: CorrectionResult;
};

export default function CorrectionCard({ correction }: Props) {
  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4 shadow-sm">
      <div className="text-sm font-black text-blue-800">
        이렇게 말하면 더 자연스러워요
      </div>

      <div className="mt-2 text-xl font-black text-slate-950">
        {correction.corrected}
      </div>

      <div className="mt-2 text-base font-bold text-slate-800">
        {correction.note}
      </div>

      <button
        onClick={() => speakEnglish(correction.corrected)}
        className="mt-3 rounded-full bg-blue-700 px-4 py-2 text-sm font-black text-white"
      >
        🔊 문장 듣기
      </button>
    </div>
  );
}