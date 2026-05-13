import { NextResponse } from "next/server";
import { fetchKpiSummary } from "@/lib/api";

export async function GET() {
  const data = await fetchKpiSummary();
  return NextResponse.json(data);
}
