import { JSX } from "react";

export function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div>
      <div className={`${tone ?? "text-gray-600"} mb-1`}>{icon}</div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
