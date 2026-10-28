"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
export default function HealthChart({
  points,
  unit,
}: {
  points: { date: string; value: number }[];
  unit: string;
}) {
  return (
    <div
      className="chart"
      role="img"
      aria-label={
        "Histórico diário: " +
        points.map((p) => `${p.date}: ${p.value.toFixed(1)} ${unit}`).join("; ")
      }
    >
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart
          data={points}
          margin={{ left: 0, right: 16, top: 15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a9b7c5" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#a9b7c5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#ecece8" />
          <XAxis
            dataKey="date"
            tickFormatter={(v) =>
              String(v).slice(5).split("-").reverse().join("/")
            }
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#767676" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={45}
            tick={{ fontSize: 11, fill: "#767676" }}
          />
          <Tooltip
            formatter={(v) => [
              Number(v).toFixed(1) + " " + unit,
              "Registro diário",
            ]}
          />
          <Area
            dataKey="value"
            stroke="#5b7285"
            fill="url(#fill)"
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
