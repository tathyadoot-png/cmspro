"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type DataType = {
  day: string;
  risk: number;
};

type Props = {
  data: DataType[];
};

export default function RiskTrendChart({ data }: Props) {
  return (
    <div className="bg-white shadow rounded-xl p-5 border h-[300px]">
      <h2 className="text-lg font-semibold mb-4">Risk Trend</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="risk"
            stroke="#ef4444"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}