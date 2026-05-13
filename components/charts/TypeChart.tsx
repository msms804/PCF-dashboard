"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#16a34a", "#3b82f6", "#f59e0b"];

type Props = {
  data: { type: string; co2e: number }[];
};

export default function TypeChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="co2e"
          nameKey="type"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} kgCO₂e`]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
