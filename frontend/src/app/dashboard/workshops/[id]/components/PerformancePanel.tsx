"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PerformancePanel({ workshopId }: any) {

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workshopId) {
      fetchPerformance();
    }
  }, [workshopId]);

  const fetchPerformance = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/performancee/workshop/${workshopId}`
      );

      setUsers(res.data.data || []);

    } catch (error) {
      console.error("Performance fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-sm">Loading...</p>;
  }

  if (users.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No performance data
      </div>
    );
  }

  // 🔥 Sort for leaderboard
  const sortedUsers = [...users].sort(
    (a, b) => b.completedTasks - a.completedTasks
  );

  return (

    <div className="space-y-6">

      {/* 🔥 LEADERBOARD */}

      <div className="border rounded-lg p-4">

        <h2 className="font-semibold mb-3">
          🏆 Leaderboard
        </h2>

        <div className="space-y-2">

          {sortedUsers.slice(0, 5).map((u, i) => (

            <div
              key={u.userId}
              className="flex justify-between border-b pb-2"
            >

              <span>
                #{i + 1} {u.name}
              </span>

              <span className="font-semibold">
                {u.completedTasks} tasks
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* 🔥 GRAPH */}

      <div className="border rounded-lg p-4">

        <h2 className="font-semibold mb-3">
          📊 Performance Graph
        </h2>

        <div className="w-full h-64">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={users}>

              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="completedTasks" />
              <Bar dataKey="lateTasks" />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* 🔥 USER CARDS */}

      <div className="space-y-3">

        {users.map((u: any) => (

          <div
            key={u.userId}
            className="border rounded-lg p-4 flex justify-between"
          >

            <div>

              <p className="font-semibold">
                {u.name}
              </p>

              <p className="text-xs text-gray-500">
                Completed: {u.completedTasks}
              </p>

              <p className="text-xs text-gray-500">
                Late: {u.lateTasks}
              </p>

              <p className="text-xs text-gray-500">
                Avg Time: {u.avgMinutes} min
              </p>

            </div>

            <div className="font-semibold">
              {u.ratingTag}
            </div>

          </div>

        ))}

      </div>

    </div>

  );

}