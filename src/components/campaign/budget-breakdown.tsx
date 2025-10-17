import { formatCurrency } from "@/lib/utils/currency-utils";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function BudgetItem({
  title,
  amount,
  percent,
}: {
  title: string;
  amount: number;
  percent: number;
}) {
  const pct = clamp(Math.round(percent || 0), 0, 100);
  return (
    <div className="rounded-2xl border p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <span className="text-sm text-gray-500">{pct}%</span>
      </div>
      <div className="text-sm text-gray-600 mb-3">
        {formatCurrency(amount || 0)}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-2 bg-[#E77731]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function BudgetBreakdown({
  items,
}: {
  items: Array<{ title: string; amount: number; percent: number }>;
}) {
  if (!items?.length) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((it) => (
        <BudgetItem
          key={it.title}
          title={it.title}
          amount={it.amount}
          percent={it.percent}
        />
      ))}
    </div>
  );
}
