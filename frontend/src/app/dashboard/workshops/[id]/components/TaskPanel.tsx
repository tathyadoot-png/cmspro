"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const columns = [
  "ASSIGNED",
  "IN_PROGRESS",
  "IN_REVIEW",
  "APPROVED",
  "CHANGES_REQUESTED"
];

export default function TaskPanel({ workshopId }: any) {

  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
  }, [workshopId]);

  const fetchTasks = async () => {

    const res = await api.get(`/tasks?workshopId=${workshopId}`);

    setTasks(res.data.data || []);

  };

  const updateStatus = async (taskId: string, status: string) => {

    await api.patch(`/tasks/${taskId}/status`, { status });

    fetchTasks();

  };

  return (

    <div className="grid grid-cols-5 gap-3">

      {columns.map((col) => {

        const colTasks = tasks.filter(t => t.status === col);

        return (

          <div key={col} className="bg-gray-50 border rounded p-2">

            <h3 className="font-semibold mb-2 text-sm">
              {col}
            </h3>

            {colTasks.map((task) => (

              <div
                key={task._id}
                className="bg-white border rounded p-2 mb-2 text-sm"
              >

                <div className="font-medium">
                  {task.title}
                </div>

                <div className="text-xs text-gray-500">
                  {task.assignedTo?.name}
                </div>

                <select
                  className="mt-2 border text-xs"
                  value={task.status}
                  onChange={(e) =>
                    updateStatus(task._id, e.target.value)
                  }
                >

                  {columns.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}

                </select>

              </div>

            ))}

          </div>

        );

      })}

    </div>

  );

}