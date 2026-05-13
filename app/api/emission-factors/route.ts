import { NextResponse } from "next/server";
import { fetchEmissionFactors } from "@/lib/api";

// 배출 계수 목록 반환
export async function GET() {
  const data = await fetchEmissionFactors();
  return NextResponse.json(data);
}
