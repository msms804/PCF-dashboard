export type ActivityType = "electricity" | "raw_material" | "transport";

//CT-045 엑셀의 한 행
export type Activity = {
  id: string;
  date: string;
  activityType: ActivityType;
  description: string;
  amount: number;
  unit: string;
};

export type EmissionFactor = {
  id: string;
  activityType: ActivityType;
  description: string;
  coefficient: number; // 계수
  unit: string;
  version: number;
  effectiveFrom: string;
};
