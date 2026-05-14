import { fetchEmissionFactors } from "@/lib/api";

const typeLabels: Record<string, string> = {
  electricity: "전기",
  raw_material: "원소재",
  transport: "운송",
};

export default async function EmissionFactorsPage() {
  const factors = await fetchEmissionFactors();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">배출계수</h1>
        <p className="text-sm text-gray-500 mt-1">활동 유형별 CO₂e 배출계수 및 버전 이력</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">활동 유형</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">항목</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">계수</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">단위</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">버전</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">적용일</th>
            </tr>
          </thead>
          <tbody>
            {factors.map((f) => (
              <tr key={f.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{typeLabels[f.activityType] ?? f.activityType}</td>
                <td className="px-4 py-3 text-gray-700">{f.description}</td>
                <td className="px-4 py-3 text-gray-900 font-medium text-right">{f.coefficient}</td>
                <td className="px-4 py-3 text-gray-500">{f.unit}</td>
                <td className="px-4 py-3 text-gray-700 text-right">v{f.version}</td>
                <td className="px-4 py-3 text-gray-700">{f.effectiveFrom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
