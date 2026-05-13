import { NextRequest, NextResponse } from "next/server";
import { fetchActivities, createActivity } from "@/lib/api";

// 전체 활동 데이터 반환
export async function GET() {
  const data = await fetchActivities();
  return NextResponse.json(data);
}

// 새 활동 추가
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { date, activityType, description, amount, unit } = body;

  if (!date || !activityType || !description || !amount || !unit) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  try {
    const created = await createActivity({ date, activityType, description, amount: Number(amount), unit });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "저장에 실패했습니다. 다시 시도해주세요." }, { status: 500 });
  }
}
