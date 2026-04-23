import type { CorrectionResult } from "@/lib/correction";

type Props = {
  correction: CorrectionResult;
};

export default function CorrectionCard({ correction }: Props) {
  return (
    <div className="rounded-2xl bg-emerald-50 p-4">
      <div className="text-sm text-slate-500">추천 문장</div>
      <div className="mt-1 text-lg font-semibold">{correction.corrected}</div>
      <div className="mt-2 text-sm text-slate-600">{correction.note}</div>
    </div>
  );
}