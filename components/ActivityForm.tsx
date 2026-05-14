"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "./Toast";

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
  const [importResult, setImportResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const [importing, setImporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

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
      setToast({ message: "데이터가 추가되었습니다.", type: "success" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import/excel", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImportResult(data);
      setToast({ message: `${data.imported}개 데이터가 추가되었습니다.`, type: "success" });
      router.refresh();
    } catch {
      setImportResult({ imported: 0, errors: ["파일 업로드에 실패했습니다."] });
      setToast({ message: "파일 업로드에 실패했습니다.", type: "error" });
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
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

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <div className="flex items-center gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "저장 중..." : "추가"}
          </button>

          <label className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${importing ? "opacity-50 pointer-events-none border-gray-200 text-gray-400" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
            {importing ? "업로드 중..." : "Excel로 가져오기"}
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImport}
              disabled={importing}
            />
          </label>
        </div>

        {importResult && (
          <div className="mt-3 flex flex-col gap-1">
            <p className="text-sm text-green-700 font-medium">{importResult.imported}개 데이터가 추가되었습니다.</p>
            {importResult.errors.length > 0 && (
              <div className="bg-red-50 rounded-lg p-3 flex flex-col gap-1 mt-1">
                {importResult.errors.map((e, i) => (
                  <p key={i} className="text-xs text-red-500">{e}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
