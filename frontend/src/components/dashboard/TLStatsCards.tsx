"use client";

import React from "react";

type StatsProps = {
  totalTasks: number;
  safeTasks: number;
  atRiskTasks: number;
  overdueTasks: number;
};

const Card = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className="bg-white shadow rounded-xl p-5 border">
      <h3 className="text-sm text-gray-500">{title}</h3>

      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default function TLStatsCards({
  totalTasks,
  safeTasks,
  atRiskTasks,
  overdueTasks,
}: StatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card title="Total Tasks" value={totalTasks} />
      <Card title="Safe Tasks" value={safeTasks} />
      <Card title="At Risk Tasks" value={atRiskTasks} />
      <Card title="Overdue Tasks" value={overdueTasks} />
    </div>
  );
}