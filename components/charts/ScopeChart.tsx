"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { scope: string; co2e: number }[];
};

export default function ScopeChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="scope" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} unit=" kg" />
        <Tooltip
          formatter={(value) => [`${Number(value).toLocaleString()} kgCO₂e`, "배출량"]}
        />
        <Bar dataKey="co2e" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
