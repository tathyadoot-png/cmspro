"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
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
    if (workshopId) fetchTasks();
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

    <div className="grid grid-cols-5 gap-4">

      {columns.map((col) => {

        const colTasks = tasks.filter(t => t.status === col);

        return (

          <div key={col} className="bg-gray-50 border rounded p-3">

            <h3 className="font-semibold mb-3 text-sm">
              {col.replace("_"," ")}
            </h3>

            {colTasks.length === 0 && (
              <p className="text-xs text-gray-400">
                No tasks
              </p>
            )}

            {colTasks.map((task) => (

            <div
  key={task._id}
  className={`border rounded p-3 mb-3 text-sm shadow-sm
  ${
    task.slaStatus === "OVERDUE"
      ? "bg-red-50 border-red-400"
      : "bg-white"
  }`}
>
               <Link
  href={`/dashboard/tasks/${task._id}`}
  className="font-semibold text-blue-600"
>
  {task.title}
</Link>
                <div className="text-xs text-gray-500 mt-1">
                  Assigned: {task.assignedTo?.name}
                </div>

                <div className="text-xs mt-1">
                  Priority: {task.priority}
                </div>

                <div className="text-xs mt-1">
                  SLA: {task.slaStatus}
                </div>

                <div className="text-xs mt-1">
                  Est: {task.estimatedMinutes} min
                </div>

                <select
                  className="mt-2 border text-xs p-1 w-full"
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