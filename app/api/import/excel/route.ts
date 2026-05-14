import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createActivity } from "@/lib/api";
import { ActivityType } from "@/lib/types";

const activityTypeMap: Record<string, ActivityType> = {
  전기: "electricity",
  원소재: "raw_material",
  운송: "transport",
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  let imported = 0;
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // 헤더 포함 실제 행 번호

    const date = row["일자(원본)"] ?? row["일자"];
    const activityTypeRaw = row["활동 유형"];
    const description = row["설명"];
    const amount = row["량"];
    const unit = row["단위"];

    if (!date || !activityTypeRaw || !description || !amount || !unit) {
      errors.push(`${rowNum}행: 필수 항목 누락`);
      continue;
    }

    const activityType = activityTypeMap[String(activityTypeRaw)];
    if (!activityType) {
      errors.push(`${rowNum}행: 알 수 없는 활동 유형 "${activityTypeRaw}"`);
      continue;
    }

    try {
      await createActivity({
        date: String(date),
        activityType,
        description: String(description),
        amount: Number(amount),
        unit: String(unit),
      });
      imported++;
    } catch {
      errors.push(`${rowNum}행: 저장 실패`);
    }
  }

  return NextResponse.json({ imported, errors });
}
