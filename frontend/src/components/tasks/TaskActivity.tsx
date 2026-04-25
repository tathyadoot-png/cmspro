"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TaskActivity({ taskId }: any) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (taskId) fetchLogs();
  }, [taskId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (taskId) fetchLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, [taskId]);

  const fetchLogs = async () => {
    try {
      const res = await api.get(`/audit/task/${taskId}`);
      setLogs(res.data.data || []);
    } catch (err) {
      console.error("Logs error:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Feed Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Feed</span>
        </div>
        <span className="text-[9px] font-bold text-slate-300 uppercase italic">Refresh: 5s</span>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No activity recorded</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className="group p-4 rounded-[1.5rem] border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-[10px] font-black text-slate-900 uppercase">
                  {log.userId?.name || "System"}
                </p>
                <p className="text-[8px] font-bold text-slate-400">
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {formatLog(log)}
              </p>

              <div className="mt-2 flex items-center gap-1.5">
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <p className="text-[9px] text-slate-400 font-bold">
                  {new Date(log.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatLog(log: any) {
  const highlight = (text: string) => <span className="text-slate-900 font-black tracking-tight">{text}</span>;

  switch (log.actionType) {
    case "TASK_CREATED":
      return "Initialized the task deployment";
    case "TASK_STARTED":
      return "Engaged and started active operations";
    case "TASK_SUBMITTED":
      return "Submitted the final deliverables for review";
    case "TASK_APPROVED":
      return "Approved the task successfully";
    case "REVISION_REQUESTED":
      return "Requested revisions on the submission";
    case "TASK_STATUS_CHANGED":
      return (
        <>
          Transitioned status from {highlight(log.oldValue)} to {highlight(log.newValue)}
        </>
      );
    default:
      return log.actionType;
  }
}