import type { CorrectionResult } from "@/lib/correction";
import { speakEnglish } from "@/services/tts";

type Props = {
  correction: CorrectionResult;
};

export default function CorrectionCard({ correction }: Props) {
  return (
    <div className="rounded-2xl border-2 border-green-100 bg-green-50 p-4">
      <div className="text-sm font-bold text-green-700">이렇게 말하면 더 자연스러워요</div>

      <div className="mt-2 text-xl font-bold text-slate-950">
        {correction.corrected}
      </div>

      <div className="mt-2 text-base font-medium text-slate-700">
        {correction.note}
      </div>

      <button
        onClick={() => speakEnglish(correction.corrected)}
        className="mt-3 rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-white"
      >
        🔊 문장 듣기
      </button>
    </div>
  );
}