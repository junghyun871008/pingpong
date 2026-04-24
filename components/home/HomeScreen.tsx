import ReviewCard from "@/components/review/ReviewCard";
import XPBar from "@/components/home/XPBar";

type Props = {
  title: string;
  reviewItems: string[];
  streak: number;
  totalXP: number;
  level: number;
  onStart: () => void;
  onReady: () => void;
};

export default function HomeScreen({ title, reviewItems, streak, totalXP, level, onStart, onReady }: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-black text-blue-800">
          🏓 PingPong
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          🔥 {streak}일 연속
        </div>
      </div>
      <div className="mt-5">
        <XPBar totalXP={totalXP} level={level} />
      </div>
      <h1 className="mt-6 text-3xl font-black text-slate-950">오늘도 한 문장 🙂</h1>
      <p className="mt-2 text-base font-bold text-slate-800">AI 문장을 듣고, 천천히 한 문장씩 말해요.</p>
      <button onClick={onReady} className="mt-5 h-12 w-full rounded-2xl bg-blue-100 text-base font-black text-blue-800 shadow-sm">
        🔊 소리 준비하기
      </button>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
          <div className="text-sm font-black text-blue-800">오늘의 상황</div>
          <div className="mt-2 text-lg font-black text-slate-950">{title}</div>
        </div>
        <div className="rounded-2xl bg-slate-100 p-4 ring-1 ring-slate-200">
          <div className="text-sm font-black text-slate-800">복습 표현</div>
          <div className="mt-2 text-lg font-black text-slate-950">{reviewItems.length}문장</div>
        </div>
      </div>
      <button onClick={onStart} className="mt-5 h-16 w-full rounded-2xl bg-slate-950 text-xl font-black text-white shadow-md active:scale-95">
        오늘의 대화 시작 🚀
      </button>
      <div className="mt-6">
        <ReviewCard items={reviewItems} />
      </div>
    </div>
  );
}
