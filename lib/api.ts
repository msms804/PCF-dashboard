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
