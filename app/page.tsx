import KpiCard from "@/components/KpiCard";
import { fetchKpiSummary } from "@/lib/api";

export default async function DashboardPage() {
  const kpi = await fetchKpiSummary();

  const changeAbs = Math.abs(kpi.changePercent);
  const changeTrend = kpi.changePercent > 0 ? "up" : kpi.changePercent < 0 ? "down" : "neutral";
  const changeLabel = kpi.changePercent > 0 ? `↑ ${changeAbs}%` : kpi.changePercent < 0 ? `↓ ${changeAbs}%` : "0%";

  return (
    <div className="flex flex-col gap-8">

      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">탄소 배출 현황을 한눈에 확인하세요</p>
      </div>

      {/* KPI 카드 3개 */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCard
          label="총 CO₂e 배출량"
          value={kpi.totalCo2e.toLocaleString()}
          unit="kgCO₂e"
        />
        <KpiCard
          label="전월 대비"
          value={changeLabel}
          unit="전월 기준"
          trend={changeTrend}
        />
        <KpiCard
          label="최대 배출원"
          value={kpi.topEmitter.description}
          unit={`${kpi.topEmitter.co2e.toLocaleString()} kgCO₂e`}
        />
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">월별 CO₂e 배출 추이</p>
          <div className="h-64 flex items-center justify-center text-gray-300 text-sm">
            차트 영역
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">활동 유형별 배출 비중</p>
          <div className="h-52 flex items-center justify-center text-gray-300 text-sm">
            차트 영역
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">Scope별 배출량</p>
          <div className="h-52 flex items-center justify-center text-gray-300 text-sm">
            차트 영역
          </div>
        </div>
      </div>

    </div>
  );
}
