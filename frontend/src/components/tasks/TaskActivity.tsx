"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TaskActivity({ taskId }: any) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (taskId) fetchLogs();
  }, [taskId]);

  // 🔥 AUTO REFRESH
  useEffect(() => {
    const interval = setInterval(() => {
      if (taskId) fetchLogs();
    }, 5000);

    return () => clearInterval(interval);
  }, [taskId]);

  const fetchLogs = async () => {
    try {
      // ✅ FIXED API
      const res = await api.get(`/audit/task/${taskId}`);
      setLogs(res.data.data || []);
    } catch (err) {
      console.error("Logs error:", err);
    }
  };

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">

      {logs.length === 0 && (
        <p className="text-xs text-gray-400">No activity yet</p>
      )}

      {logs.map((log) => (
        <div
          key={log._id}
          className="p-3 rounded-xl border bg-gray-50 hover:bg-white transition"
        >
          <p className="text-[11px] font-bold text-slate-700">
            {log.userId?.name || "User"}
          </p>

          <p className="text-[10px] text-slate-600">
            {formatLog(log)}
          </p>

          <p className="text-[9px] text-gray-400 mt-1">
            {new Date(log.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

// 🔥 HUMAN READABLE LOGS
function formatLog(log: any) {
  switch (log.actionType) {
    case "TASK_CREATED":
      return "Created this task";
    case "TASK_STARTED":
      return "Started working on task";
    case "TASK_SUBMITTED":
      return "Submitted the task";
    case "TASK_APPROVED":
      return "Approved the task";
    case "REVISION_REQUESTED":
      return "Requested revision";
    case "TASK_STATUS_CHANGED":
      return `Changed status from ${log.oldValue} → ${log.newValue}`;
    default:
      return log.actionType;
  }
}