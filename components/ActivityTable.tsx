import { ActivityWithCo2e } from "@/lib/api";

const typeLabels: Record<string, string> = {
  electricity: "전기",
  raw_material: "원소재",
  transport: "운송",
};

type Props = {
  data: ActivityWithCo2e[];
};

export default function ActivityTable({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">일자</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">활동 유형</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">설명</th>
            <th className="text-right px-4 py-3 text-gray-500 font-medium">량</th>
            <th className="text-left px-4 py-3 text-gray-500 font-medium">단위</th>
            <th className="text-right px-4 py-3 text-gray-500 font-medium">CO₂e (kg)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-700">{row.date}</td>
              <td className="px-4 py-3 text-gray-700">{typeLabels[row.activityType] ?? row.activityType}</td>
              <td className="px-4 py-3 text-gray-700">{row.description}</td>
              <td className="px-4 py-3 text-gray-700 text-right">{row.amount.toLocaleString()}</td>
              <td className="px-4 py-3 text-gray-700">{row.unit}</td>
              <td className="px-4 py-3 text-gray-900 font-medium text-right">{row.co2e.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
