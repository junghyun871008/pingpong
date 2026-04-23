type Props = {
  items: string[];
};

export default function ReviewCard({ items }: Props) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="mb-3 text-sm font-medium text-slate-700">복습 표현</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-white px-3 py-1 text-sm shadow-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}