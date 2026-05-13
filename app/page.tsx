export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">

      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">탄소 배출 현황을 한눈에 확인하세요</p>
      </div>

      {/* KPI 카드 3개 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "총 CO₂e 배출량", value: "—", unit: "kgCO₂e" },
          { label: "전월 대비", value: "—", unit: "%" },
          { label: "최대 배출원", value: "—", unit: "" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.unit}</p>
          </div>
        ))}
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 월별 추이 - 넓게 */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">월별 CO₂e 배출 추이</p>
          <div className="h-64 flex items-center justify-center text-gray-300 text-sm">
            차트 영역
          </div>
        </div>

        {/* 활동 유형별 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">활동 유형별 배출 비중</p>
          <div className="h-52 flex items-center justify-center text-gray-300 text-sm">
            차트 영역
          </div>
        </div>

        {/* Scope별 */}
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
