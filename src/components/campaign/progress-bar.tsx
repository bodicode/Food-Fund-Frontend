export function ProgressBar({ value }: { value: number }) {
  const width = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
      <div
        className="h-3 bg-[#f97316] rounded-full transition-all"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
