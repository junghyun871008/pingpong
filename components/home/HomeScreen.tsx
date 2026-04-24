import ReviewCard from "@/components/review/ReviewCard";

type Props = {
  title: string;
  reviewItems: string[];
  streak: number;
  onStart: () => void;
  onReady: () => void;
};

export default function HomeScreen({ title, reviewItems, streak, onStart, onReady }: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold">PingPong</div>
        <div className="text-sm font-semibold text-slate-700">매일 오전 8:20</div>
      </div>

      <h1 className="mt-6 text-3xl font-black text-slate-950">오늘도 한 문장 🙂</h1>
      <p className="mt-2 text-base font-semibold text-slate-700">
        AI 문장을 듣고, 천천히 한 문장씩 말해요.
      </p>

      <button
        onClick={onReady}
        className="mt-5 h-12 w-full rounded-2xl bg-green-500 text-base font-bold text-white"
      >
        🔊 소리·마이크 준비하기
      </button>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm font-bold text-slate-700">오늘의 상황</div>
          <div className="mt-2 text-lg font-black text-slate-950">{title}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm font-bold text-slate-700">복습</div>
          <div className="mt-2 text-lg font-black text-slate-950">{reviewItems.length}문장</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm font-bold text-slate-700">연속 학습</div>
          <div className="mt-2 text-lg font-black text-slate-950">{streak} days</div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="mt-6 h-14 w-full rounded-2xl bg-slate-900 text-base font-bold text-white"
      >
        오늘의 대화 시작
      </button>

      <div className="mt-6">
        <ReviewCard items={reviewItems} />
      </div>
    </div>
  );
}