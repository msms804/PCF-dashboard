import KpiCard from "@/components/KpiCard";
import TrendChart from "@/components/charts/TrendChart";
import TypeChart from "@/components/charts/TypeChart";
import ScopeChart from "@/components/charts/ScopeChart";
import { fetchKpiSummary, fetchChartData } from "@/lib/api";

export default async function DashboardPage() {
  const [kpi, chartData] = await Promise.all([
    fetchKpiSummary(),
    fetchChartData(),
  ]);

  const changeAbs = Math.abs(kpi.changePercent);
  const changeTrend = kpi.changePercent > 0 ? "up" : kpi.changePercent < 0 ? "down" : "neutral";
  const changeLabel = kpi.changePercent > 0 ? `↑ ${changeAbs}%` : kpi.changePercent < 0 ? `↓ ${changeAbs}%` : "0%";

  return (
    <div className="flex flex-col gap-8">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">탄소 배출 현황을 한눈에 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">월별 CO₂e 배출 추이</p>
          <TrendChart data={chartData.trend} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">활동 유형별 배출 비중</p>
          <TypeChart data={chartData.byType} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">Scope별 배출량</p>
          <ScopeChart data={chartData.byScope} />
        </div>
      </div>

    </div>
  );
}
