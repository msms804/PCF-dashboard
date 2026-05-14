"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const activityTypes = [
  { value: "electricity", label: "전기" },
  { value: "raw_material", label: "원소재" },
  { value: "transport", label: "운송" },
];

const descriptionOptions: Record<string, string[]> = {
  electricity: ["한국전력"],
  raw_material: ["플라스틱 1", "플라스틱 2"],
  transport: ["트럭"],
};

const unitOptions: Record<string, string> = {
  electricity: "kWh",
  raw_material: "kg",
  transport: "ton-km",
};

export default function ActivityForm() {
  const router = useRouter();
  const [activityType, setActivityType] = useState("electricity");
  const [form, setForm] = useState({ date: "", description: "", amount: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.date || !form.description || !form.amount) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("량은 0보다 커야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: form.date,
          activityType,
          description: form.description,
          amount: Number(form.amount),
          unit: unitOptions[activityType],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "저장에 실패했습니다.");
      }

      setForm({ date: "", description: "", amount: "" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-sm font-medium text-gray-700 mb-4">새 활동 데이터 추가</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">일자</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">활동 유형</label>
          <select
            value={activityType}
            onChange={(e) => {
              setActivityType(e.target.value);
              setForm({ ...form, description: "" });
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {activityTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">설명</label>
          <select
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">선택</option>
            {descriptionOptions[activityType].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">량 ({unitOptions[activityType]})</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="0"
            min="0"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "저장 중..." : "추가"}
      </button>
    </form>
  );
}
