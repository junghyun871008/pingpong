import ReviewCard from "@/components/review/ReviewCard";

type Props = {
  title: string;
  reviewItems: string[];
  streak: number;
  onStart: () => void;
};

export default function HomeScreen({ title, reviewItems, streak, onStart }: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm">PingPong</div>
        <div className="text-sm text-slate-500">매일 오전 8:20</div>
      </div>

      <h1 className="mt-6 text-3xl font-bold">오늘도 한 문장 🙂</h1>
      <p className="mt-2 text-slate-600">
        랜덤 상황 1개를 짧게 연습하고, 원하면 AI와 더 대화해요.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">오늘의 상황</div>
          <div className="mt-2 text-lg font-semibold">{title}</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">복습</div>
          <div className="mt-2 text-lg font-semibold">{reviewItems.length}문장</div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">연속 학습</div>
          <div className="mt-2 text-lg font-semibold">{streak} days</div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="mt-6 h-14 w-full rounded-2xl bg-slate-900 text-white"
      >
        오늘의 대화 시작
      </button>

      <div className="mt-6">
        <ReviewCard items={reviewItems} />
      </div>
    </div>
  );
}