import { Activity, EmissionFactor } from "./types";
import { activities, emissionFactors } from "./data/seed";

let activityStore = [...activities];
let emissionFactorStore = [...emissionFactors];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600; // 200~800ms 랜덤 지연
const maybeFail = () => Math.random() < 0.15; // 15%확률로 실패

export type ActivityWithCo2e = Activity & { co2e: number };

// 전체 활동 데이터를 반환
export async function fetchActivities(): Promise<Activity[]> {
  await delay(jitter());
  return activityStore;
}

// CO₂e 계산값 포함한 활동 데이터 반환
export async function fetchActivitiesWithCo2e(): Promise<ActivityWithCo2e[]> {
  await delay(jitter());
  return activityStore.map((a) => ({
    ...a,
    co2e: getCo2e(a, emissionFactorStore),
  }));
}

// 배출 계수 목록 반환
export async function fetchEmissionFactors(): Promise<EmissionFactor[]> {
  await delay(jitter());
  return emissionFactorStore;
}

export async function createActivity(
  input: Omit<Activity, "id"> // id만 빼고 받음
): Promise<Activity> {
  await delay(jitter());
  if (maybeFail()) throw new Error("Save failed");
  const created: Activity = { ...input, id: crypto.randomUUID() }; // 고유 id 생성
  activityStore = [...activityStore, created];
  return created;
}

// 활동 하나를 받아서 CO₂e를 계산
function getCo2e(activity: Activity, factors: EmissionFactor[]): number {
  const factor = factors.find(
    (f) => f.activityType === activity.activityType && f.description === activity.description
  ) ?? factors.find((f) => f.activityType === activity.activityType);
  if (!factor) return 0;
  return Math.round(activity.amount * factor.coefficient * 100) / 100;
}

export type KpiSummary = {
  totalCo2e: number;
  changePercent: number; // 전월 대비 증감률
  topEmitter: { description: string; co2e: number };
};

export async function fetchKpiSummary(): Promise<KpiSummary> {
  await delay(jitter());

  const factors = emissionFactorStore;

  // 월별 CO2e 합산
  const monthMap = new Map<string, number>();
  for (const a of activityStore) {
    const ym = a.date.slice(0, 7);
    monthMap.set(ym, (monthMap.get(ym) ?? 0) + getCo2e(a, factors));
  }

  const sortedMonths = Array.from(monthMap.keys()).sort();
  const lastMonth = sortedMonths[sortedMonths.length - 1];
  const prevMonth = sortedMonths[sortedMonths.length - 2];

  const lastCo2e = monthMap.get(lastMonth) ?? 0;
  const prevCo2e = monthMap.get(prevMonth) ?? 0;
  const changePercent = prevCo2e === 0 ? 0 : Math.round(((lastCo2e - prevCo2e) / prevCo2e) * 1000) / 10;

  // 총 CO2e
  const totalCo2e = Math.round(Array.from(monthMap.values()).reduce((a, b) => a + b, 0) * 100) / 100;

  // 최대 배출원 (단건 기준)
  const top = activityStore.reduce((max, a) => {
    const co2e = getCo2e(a, factors);
    return co2e > getCo2e(max, factors) ? a : max;
  }, activityStore[0]);

  return {
    totalCo2e,
    changePercent,
    topEmitter: { description: top.description, co2e: getCo2e(top, factors) },
  };
}

export type ChartData = {
  trend: { yearMonth: string; co2e: number }[];
  byType: { type: string; co2e: number }[];
  byScope: { scope: string; co2e: number }[];
};

export async function fetchChartData(): Promise<ChartData> {
  await delay(jitter());

  const factors = emissionFactorStore;

  const monthMap = new Map<string, number>();
  const typeMap = new Map<string, number>();
  const scopeMap = new Map<string, number>();

  for (const a of activityStore) {
    const co2e = getCo2e(a, factors);
    const ym = a.date.slice(0, 7);

    monthMap.set(ym, (monthMap.get(ym) ?? 0) + co2e); // 해당 월이 이미 있으면 기존값, 없으면 0에서 시작 , 거기에 이번 activity의 CO2e 더함
    typeMap.set(a.activityType, (typeMap.get(a.activityType) ?? 0) + co2e);

    const scope = a.activityType === "electricity" ? "Scope 2" : "Scope 3";
    scopeMap.set(scope, (scopeMap.get(scope) ?? 0) + co2e);
  }

  // 월별 데이터를 날짜 오름차순 정렬
  const trend = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([yearMonth, co2e]) => ({ yearMonth, co2e: Math.round(co2e * 100) / 100 }));

  const typeLabels: Record<string, string> = {
    electricity: "전기",
    raw_material: "원소재",
    transport: "운송",
  };

  const byType = Array.from(typeMap.entries()).map(([type, co2e]) => ({
    type: typeLabels[type] ?? type,
    co2e: Math.round(co2e * 100) / 100,
  }));

  const byScope = Array.from(scopeMap.entries()).map(([scope, co2e]) => ({
    scope,
    co2e: Math.round(co2e * 100) / 100,
  }));

  return { trend, byType, byScope };
}
