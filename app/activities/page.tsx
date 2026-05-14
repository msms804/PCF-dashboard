import ActivityTable from "@/components/ActivityTable";
import ActivityForm from "@/components/ActivityForm";
import { fetchActivitiesWithCo2e } from "@/lib/api";

export default async function ActivitiesPage() {
  const activities = await fetchActivitiesWithCo2e();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">활동 데이터</h1>
        <p className="text-sm text-gray-500 mt-1">탄소 배출 활동을 입력하고 관리하세요</p>
      </div>

      <ActivityForm />
      <ActivityTable data={activities} />
    </div>
  );
}
