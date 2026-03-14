"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: {
    day: string;
    completed: number;
  }[];
}

export default function WeeklyTrendChart({ data }: Props) {
  return (
    <div className="bg-card p-6 rounded-xl shadow">

      <h2 className="font-semibold mb-4">
        Weekly Productivity Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="completed"
            stroke="#6366f1"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}