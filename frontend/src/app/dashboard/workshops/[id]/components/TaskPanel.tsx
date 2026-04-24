
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const columns = [
  "ASSIGNED",
  "IN_PROGRESS",
  "IN_REVIEW",
  "APPROVED",
];

const columnTheme: any = {
  ASSIGNED: "border-t-slate-400",
  IN_PROGRESS: "border-t-blue-500",
  IN_REVIEW: "border-t-amber-500",
  APPROVED: "border-t-emerald-500",
};

export default function TaskPanel({ workshopId }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    if (workshopId) fetchTasks();
  }, [workshopId]);

  const fetchTasks = async () => {
    const res = await api.get(`/tasks?workshopId=${workshopId}`);
    setTasks(res.data.data || []);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();

    if (diff <= 0) return "Overdue";

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    return `${mins}m ${secs}s`;
  };

  const updateStatus = async (taskId: string, status: string) => {
    try {
      if (status === "APPROVED") {
        await api.patch(`/tasks/${taskId}/approve`);
      } else {
        await api.patch(`/tasks/${taskId}/status`, { status });
      }

      await fetchTasks();
      window.dispatchEvent(new Event("TASK_UPDATED"));

    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar min-h-[70vh]">
      {columns.map((col) => {
        const colTasks = tasks?.filter((t) => t.status === col) || [];

        return (
          <div
            key={col}
            className={`flex-shrink-0 w-80 bg-gray-50/50 rounded-[2rem] border-t-4 ${columnTheme[col]} p-5 flex flex-col`}
          >

            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="font-black text-[11px] text-slate-900 uppercase tracking-[0.2em]">
                {col.replace("_", " ")}
              </h3>
              <span className="bg-white border text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {colTasks.length}
              </span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-300px)] pr-1">
              {colTasks.map((task) => {
                const isOverdue = task.slaStatus === "OVERDUE";

                return (
                  <div
                    key={task._id}
                    className={`group relative bg-white border ${isOverdue
                      ? "border-rose-200 shadow-rose-100/50"
                      : "border-gray-100"
                      } p-5 rounded-[1.5rem] shadow hover:shadow-xl transition-all`}
                  >

                    {/* 🔴 OVERDUE BADGE */}
                    {isOverdue && (
                      <div className="absolute top-0 right-5 -translate-y-1/2 bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">
                        Overdue
                      </div>
                    )}

                    {/* ⚡ FASTEST BADGE */}
                    {task.status === "APPROVED" &&
                      task.actualMinutes > 0 &&
                      task.estimatedMinutes > 0 &&
                      task.actualMinutes < task.estimatedMinutes * 0.7 && (
                        <div className="absolute top-0 left-5 -translate-y-1/2 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                          ⚡ Fast
                        </div>
                      )}
                    <Link
                      href={`/dashboard/tasks/${task._id}`}
                      className="block text-sm font-black text-slate-800 mb-3 hover:text-rose-600"
                    >
                      {task.title}
                    </Link>

                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-y-3 mb-4">

                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase">User</p>
                        <p className="text-[10px] font-bold text-slate-600">
                          {task.assignedTo?.name || "Unassigned"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[8px] font-black text-gray-400 uppercase">Priority</p>
                        <p className="text-[10px] font-black text-slate-600">
                          {task.priority}
                        </p>
                      </div>

                      {/* ⏱ TIME BLOCK */}
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase">Time</p>

                        <p className={`text-[10px] font-bold 
  ${task.status === "APPROVED"
                            ? task.isOnTime
                              ? "text-emerald-600"
                              : "text-rose-500"
                            : task.slaStatus === "OVERDUE"
                              ? "text-rose-500 animate-pulse"
                              : task.slaStatus === "AT_RISK"
                                ? "text-amber-500"
                                : "text-slate-700"
                          }`}>

                          {task.status === "APPROVED"
                            ? task.actualMinutes > 0
                              ? `Completed in ${task.actualMinutes} min ⚡`
                              : "Completed"
                            : task.deadlineAt
                              ? getTimeLeft(task.deadlineAt)
                              : "--"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[8px] font-black text-gray-400 uppercase">SLA</p>
                        <p className="text-[10px] font-bold">
                          {task.slaStatus}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <select
                      disabled={task.status === "APPROVED"}
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(task._id, e.target.value)
                      }
                      className="w-full bg-gray-50 rounded-xl px-3 py-2 text-[9px] font-black uppercase"
                    >
                      {columns.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>

                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}