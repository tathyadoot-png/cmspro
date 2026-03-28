// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";
// import Link from "next/link";
// const columns = [
//   "ASSIGNED",
//   "IN_PROGRESS",
//   "IN_REVIEW",
//   "APPROVED",
//   "CHANGES_REQUESTED"
// ];

// export default function TaskPanel({ workshopId }: any) {

//   const [tasks, setTasks] = useState<any[]>([]);

//   useEffect(() => {
//     if (workshopId) fetchTasks();
//   }, [workshopId]);

//   const fetchTasks = async () => {

//     const res = await api.get(`/tasks?workshopId=${workshopId}`);

//     setTasks(res.data.data || []);

//   };

//   const updateStatus = async (taskId: string, status: string) => {

//     await api.patch(`/tasks/${taskId}/status`, { status });

//     fetchTasks();

//   };

//   return (

//     <div className="grid grid-cols-5 gap-4">

//       {columns.map((col) => {

//         const colTasks = tasks.filter(t => t.status === col);

//         return (

//           <div key={col} className="bg-gray-50 border rounded p-3">

//             <h3 className="font-semibold mb-3 text-sm">
//               {col.replace("_"," ")}
//             </h3>

//             {colTasks.length === 0 && (
//               <p className="text-xs text-gray-400">
//                 No tasks
//               </p>
//             )}

//             {colTasks.map((task) => (

//             <div
//   key={task._id}
//   className={`border rounded p-3 mb-3 text-sm shadow-sm
//   ${
//     task.slaStatus === "OVERDUE"
//       ? "bg-red-50 border-red-400"
//       : "bg-white"
//   }`}
// >
//                <Link
//   href={`/dashboard/tasks/${task._id}`}
//   className="font-semibold text-blue-600"
// >
//   {task.title}
// </Link>
//                 <div className="text-xs text-gray-500 mt-1">
//                   Assigned: {task.assignedTo?.name}
//                 </div>

//                 <div className="text-xs mt-1">
//                   Priority: {task.priority}
//                 </div>

//                 <div className="text-xs mt-1">
//                   SLA: {task.slaStatus}
//                 </div>

//                 <div className="text-xs mt-1">
//                   Est: {task.estimatedMinutes} min
//                 </div>

//                 <select
//                   className="mt-2 border text-xs p-1 w-full"
//                   value={task.status}
//                   onChange={(e) =>
//                     updateStatus(task._id, e.target.value)
//                   }
//                 >

//                   {columns.map((s) => (
//                     <option key={s} value={s}>
//                       {s}
//                     </option>
//                   ))}

//                 </select>

//               </div>

//             ))}

//           </div>

//         );

//       })}

//     </div>

//   );

// }

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const columns = [
  "ASSIGNED",
  "IN_PROGRESS",
  "IN_REVIEW",
  "APPROVED",
  // "CHANGES_REQUESTED"
];

const columnTheme: any = {
  ASSIGNED: "border-t-slate-400",
  IN_PROGRESS: "border-t-blue-500",
  IN_REVIEW: "border-t-amber-500",
  APPROVED: "border-t-emerald-500",
  CHANGES_REQUESTED: "border-t-rose-500"
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
      setTime(Date.now()); // 🔥 re-render trigger
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
  // 🔥 UPDATED FUNCTION
  const updateStatus = async (taskId: string, status: string) => {
    try {
      console.log("🔥 SENDING STATUS:", status);

      // 🔥 HANDLE APPROVE SEPARATELY
      if (status === "APPROVED") {
        await api.patch(`/tasks/${taskId}/approve`);
      } else {
        await api.patch(`/tasks/${taskId}/status`, { status });
      }

      await fetchTasks();

      window.dispatchEvent(new Event("TASK_UPDATED"));

    } catch (err: any) {
      console.error("❌ ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar min-h-[70vh]">
      {columns.map((col) => {
        const colTasks = tasks?.filter((t) => t.status === col) || [];

        return (
          <div
            key={col}
            className={`flex-shrink-0 w-80 bg-gray-50/50 rounded-[2rem] border-t-4 ${columnTheme[col] || 'border-t-gray-200'} p-5 flex flex-col`}
          >
            {/* Column Header */}
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="font-black text-[11px] text-slate-900 uppercase tracking-[0.2em]">
                {col.replace("_", " ")}
              </h3>
              <span className="bg-white border border-gray-200 text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                {colTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-300px)] pr-1 custom-scrollbar">
              {colTasks.length === 0 && (
                <div className="border-2 border-dashed border-gray-100 rounded-[1.5rem] py-10 text-center">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    Dock Empty
                  </p>
                </div>
              )}

              {colTasks.map((task) => {
                const isOverdue = task.slaStatus === "OVERDUE";

                return (
                  <div
                    key={task._id}
                    className={`group relative bg-white border ${isOverdue
                        ? "border-rose-200 shadow-rose-100/50"
                        : "border-gray-100"
                      } p-5 rounded-[1.5rem] shadow-[0_10px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 hover:-translate-y-1`}
                  >
                    {isOverdue && (
                      <div className="absolute top-0 right-5 -translate-y-1/2 bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                        Overdue
                      </div>
                    )}

                    <Link
                      href={`/dashboard/tasks/${task._id}`}
                      className="block text-sm font-black text-slate-800 leading-tight mb-3 hover:text-rose-600"
                    >
                      {task.title}
                    </Link>

                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-y-3 mb-4">
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase">User</p>
                        <p className="text-[10px] font-bold text-slate-600 truncate">
                          {task.assignedTo?.name || "Unassigned"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[8px] font-black text-gray-400 uppercase">Priority</p>
                        <p className="text-[10px] font-black text-slate-600">
                          {task.priority}
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase">Time</p>
                        <p className={`text-[10px] font-bold ${task.slaStatus === "OVERDUE"
                            ? "text-rose-500 animate-pulse"
                            : task.slaStatus === "AT_RISK"
                              ? "text-amber-500"
                              : "text-slate-700"
                          }`}>
                          {task.deadlineAt
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

                    {/* Status Select */}
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