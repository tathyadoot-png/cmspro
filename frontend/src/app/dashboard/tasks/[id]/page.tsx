// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { api } from "@/lib/api";

// import TaskTimeline from "@/components/tasks/TaskTimeline";
// import TaskActivity from "@/components/tasks/TaskActivity";
// import TaskComments from "@/components/tasks/TaskComments";
// import TaskFiles from "@/components/tasks/TaskFiles";

// export default function TaskDetailPage() {

//   const params = useParams();
//   const taskId = params?.id;

//   const [task,setTask] = useState<any>(null);

//   useEffect(()=>{
//     if(taskId) fetchTask();
//   },[taskId]);

//   const fetchTask = async () => {

//     try{

//       const res = await api.get(`/tasks/${taskId}`);

//       setTask(res.data.data);

//     }catch(err){

//       console.error(err);

//     }

//   };

//   if(!task) return <div>Loading...</div>;

//   return (

//     <div className="space-y-6">

//       <div className="space-y-2">

//         <h1 className="text-xl font-semibold">
//           {task.title}
//         </h1>

//         <p className="text-sm text-gray-500">
//           {task.description}
//         </p>

//       </div>

//       <div className="grid md:grid-cols-2 gap-6">

//         <TaskTimeline task={task} />

//         <TaskActivity taskId={task._id} />

//       </div>

//       <TaskComments taskId={task._id} />

//       <TaskFiles taskId={task._id} />

//     </div>

//   );

// }


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

import TaskTimeline from "@/components/tasks/TaskTimeline";
import TaskActivity from "@/components/tasks/TaskActivity";
import TaskComments from "@/components/tasks/TaskComments";
import TaskFiles from "@/components/tasks/TaskFiles";

// 🔥 countdown helper
const getTimeLeft = (deadline: string) => {
  const diff = new Date(deadline).getTime() - Date.now();

  if (diff <= 0) return "Overdue";

  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;

  return `${hrs}h ${remMins}m`;
};

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params?.id;

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, forceUpdate] = useState(0);

  // 🔥 live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((p) => p + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (taskId) fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tasks/${taskId}`);
      setTask(res.data.data);
    } catch (err) {
      console.error("Failed to fetch task:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Loading Task Intelligence...
        </p>
      </div>
    );

  if (!task)
    return (
      <div className="p-8 text-center bg-rose-50 rounded-[2rem] border border-rose-100">
        <p className="text-rose-600 font-bold uppercase text-xs tracking-widest">
          Task Not Found
        </p>
      </div>
    );

  const isOverdue = task.slaStatus === "OVERDUE";

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-10">

      {/* HEADER */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative">

        {/* Status Badge */}
        <div className="absolute top-6 right-6">
          <span className={`px-4 py-1 rounded-full text-[10px] font-black ${
            task.slaStatus === "OVERDUE"
              ? "bg-rose-100 text-rose-600"
              : task.slaStatus === "AT_RISK"
              ? "bg-amber-100 text-amber-600"
              : "bg-emerald-100 text-emerald-600"
          }`}>
            {task.slaStatus}
          </span>
        </div>

        <div className="space-y-4 max-w-3xl">

          <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em]">
            Task Overview
          </p>

          <h1 className="text-4xl font-black text-slate-900">
            {task.title}
          </h1>

          <p className="text-sm text-slate-500">
            {task.description}
          </p>

          {/* 🔥 STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t">

            <Stat label="Assigned To" value={task.assignedTo?.name} />

            <Stat label="Priority" value={task.priority} />

            <Stat
              label="Time Left"
              value={
                task.deadlineAt
                  ? getTimeLeft(task.deadlineAt)
                  : "--"
              }
              highlight={task.slaStatus}
            />

            <Stat
              label="Actual Time"
              value={
                task.actualMinutes
                  ? `${task.actualMinutes} min`
                  : "--"
              }
            />

          </div>

          {/* 🔥 IMAGES */}
          {task.taskImages?.length > 0 && (
            <div className="flex gap-3 flex-wrap pt-4">
              {task.taskImages.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  className="w-28 h-20 rounded-xl object-cover border hover:scale-105 transition"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-8">

        <Card title="Timeline" color="rose">
          <TaskTimeline task={task} />
        </Card>

        <Card title="Activity" color="dark">
          <TaskActivity taskId={task._id} />
        </Card>

      </div>

      {/* COMMENTS + FILES */}
      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">
          <Card title="Comments" color="blue">
            <TaskComments taskId={task._id} />
          </Card>
        </div>

        <div>
          <Card title="Files" color="amber">
            <TaskFiles taskId={task._id} />
          </Card>
        </div>

      </div>

    </div>
  );
}

// 🔥 reusable stat
function Stat({ label, value, highlight }: any) {
  return (
    <div>
      <p className="text-[9px] uppercase text-gray-400">{label}</p>
      <p className={`text-sm font-black ${
        highlight === "OVERDUE"
          ? "text-rose-500"
          : highlight === "AT_RISK"
          ? "text-amber-500"
          : "text-slate-800"
      }`}>
        {value || "--"}
      </p>
    </div>
  );
}

// 🔥 reusable card
function Card({ title, children, color }: any) {
  const colors: any = {
    rose: "bg-rose-600",
    dark: "bg-slate-900",
    blue: "bg-blue-600",
    amber: "bg-amber-500",
  };

  return (
    <div className="bg-white rounded-[2.5rem] border p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className={`w-1.5 h-6 ${colors[color]} rounded-full`} />
        <h2 className="text-[11px] font-black uppercase tracking-widest">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}