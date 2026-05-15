"use client";

import { useState } from "react";
import { ActivityWithCo2e } from "@/lib/api";

const typeLabels: Record<string, string> = {
  electricity: "전기",
  raw_material: "원소재",
  transport: "운송",
};

const PAGE_SIZE = 10;

type Props = {
  data: ActivityWithCo2e[];
};

export default function ActivityTable({ data }: Props) {
  const [page, setPage] = useState(1);

  const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <p className="text-sm text-gray-500">
          {sorted.length}개 중 {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)}개
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">일자</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">활동 유형</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">설명</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">량</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">단위</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">CO₂e (kg)</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{row.date}</td>
                <td className="px-4 py-3 text-gray-700">{typeLabels[row.activityType] ?? row.activityType}</td>
                <td className="px-4 py-3 text-gray-700">{row.description}</td>
                <td className="px-4 py-3 text-gray-700 text-right">{row.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-700">{row.unit}</td>
                <td className="px-4 py-3 text-gray-900 font-medium text-right">{row.co2e.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center text-sm text-gray-500">
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-md border ${page === p ? "bg-green-600 text-white border-green-600" : "border-gray-200 hover:bg-gray-50"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
