type Props = {
  label: string;
  value: string;
  unit?: string;
  trend?: "up" | "down" | "neutral";
};

export default function KpiCard({ label, value, unit, trend }: Props) {
  const trendColor =
    trend === "up" ? "text-red-500" :
    trend === "down" ? "text-green-500" :
    "text-gray-400";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-semibold mt-2 ${trend ? trendColor : "text-gray-900"}`}>
        {value}
      </p>
      {unit && <p className="text-sm text-gray-400 mt-1">{unit}</p>}
    </div>
  );
}
