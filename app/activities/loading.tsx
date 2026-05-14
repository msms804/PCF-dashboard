export default function ActivitiesLoading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">

      <div>
        <div className="h-7 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-48 bg-gray-100 rounded mt-2" />
      </div>

      {/* 폼 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-4 w-36 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-3 w-12 bg-gray-200 rounded" />
              <div className="h-9 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
        <div className="h-9 w-20 bg-gray-200 rounded-lg mt-4" />
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-10 bg-gray-50 border-b border-gray-200" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b border-gray-100">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-12 bg-gray-200 rounded ml-auto" />
          </div>
        ))}
      </div>

    </div>
  );
}
