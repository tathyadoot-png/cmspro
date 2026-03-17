"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function WorkshopStats({ workshopId }: any) {

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {

    const res = await api.get(`/workshops/${workshopId}/stats`);

    setStats(res.data.data);

  };

  if (!stats) return null;

  return (

    <div className="grid grid-cols-5 gap-4">

      <Card title="Total Tasks" value={stats.totalTasks} />
      <Card title="Completed" value={stats.completed} />
      <Card title="In Progress" value={stats.inProgress} />
      <Card title="Overdue" value={stats.overdue} />
      <Card title="Members" value={stats.members} />

    </div>

  );

}

function Card({ title, value }: any) {

  return (

    <div className="border rounded-lg p-4">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-xl font-bold">
        {value}
      </p>

    </div>

  );

}