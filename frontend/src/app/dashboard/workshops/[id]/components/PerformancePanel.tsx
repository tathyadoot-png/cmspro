"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function PerformancePanel({ workshopId }: any) {

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (workshopId) {
      fetchPerformance();
    }
  }, [workshopId]);

  const fetchPerformance = async () => {

    try {

      const res = await api.get(
        `/performance/workshop/${workshopId}`
      );

      setUsers(res.data.data || []);

    } catch (error) {

      console.error("Performance fetch error", error);

    }

  };

  if (users.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No performance data
      </div>
    );
  }

  return (

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

  );

}