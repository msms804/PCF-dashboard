export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">

      <div>
        <div className="h-7 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-48 bg-gray-100 rounded mt-2" />
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-32 bg-gray-200 rounded mt-3" />
            <div className="h-3 w-16 bg-gray-100 rounded mt-2" />
          </div>
        ))}
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
          <div className="h-64 bg-gray-100 rounded" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="h-52 bg-gray-100 rounded" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="h-52 bg-gray-100 rounded" />
        </div>
      </div>

    </div>
  );
}
