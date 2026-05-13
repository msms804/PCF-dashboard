import { Activity, EmissionFactor } from "./types";
import { activities, emissionFactors } from "./data/seed";

let activityStore = [...activities];
let emissionFactorStore = [...emissionFactors];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600; // 200~800ms 랜덤 지연
const maybeFail = () => Math.random() < 0.15; // 15%확률로 실패

// 전체 활동 데이터를 반환
export async function fetchActivities(): Promise<Activity[]> {
  await delay(jitter());
  return activityStore;
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

// 활동 하나를 받아서 CO₂e를 계산합니다.
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
