"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

import TaskTimeline from "@/components/tasks/TaskTimeline";
import TaskActivity from "@/components/tasks/TaskActivity";
import TaskComments from "@/components/tasks/TaskComments";
import TaskFiles from "@/components/tasks/TaskFiles";

// 🔥 Optimized Time Left Logic
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
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
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
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Intelligence...</p>
    </div>
  );

  if (!task) return (
    <div className="p-10 text-center bg-rose-50 rounded-[2rem] m-10 border border-rose-100">
      <p className="text-rose-600 font-bold uppercase text-xs tracking-widest">Task Not Found</p>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-10 space-y-6 md:space-y-10">
      
      {/* 1. HEADER & META SECTION - Strategic Layout */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
        
        {/* Title & Description Block */}
        <div className="flex-1 bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-rose-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Mission Active
              </span>
              <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase border ${
                task.slaStatus === 'OVERDUE' ? 'border-rose-200 text-rose-500 bg-rose-50' : 'border-emerald-200 text-emerald-500 bg-emerald-50'
              }`}>
                {task.slaStatus}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
              {task.title}
            </h1>
            
            <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-3xl">
              {task.description || "Operational briefing not provided for this unit."}
            </p>

            {/* Images - Horizontal Scroll on Mobile, Flex Wrap on Desktop */}
            {task.taskImages?.length > 0 && (
              <div className="flex gap-4 overflow-x-auto py-6 no-scrollbar">
                {task.taskImages.map((img: string, i: number) => (
                  <img 
                    key={i} src={img} 
                    className="w-32 h-24 md:w-44 md:h-32 object-cover rounded-[1.8rem] border-2 border-white shadow-lg shrink-0 hover:scale-105 transition" 
                    alt="Task" 
                  />
                ))}
              </div>
            )}
          </div>
          {/* Background decoration */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-50 rounded-full blur-3xl -z-0" />
        </div>

        {/* Tactical Stats Panel (Vertical on desktop, grid on mobile) */}
        <div className="lg:w-80 w-full grid grid-cols-2 lg:grid-cols-1 gap-4">
          <StatBox label="OPERATOR" value={task.assignedTo?.name} color="text-blue-600" />
          <StatBox label="PRIORITY" value={task.priority} color="text-amber-600" />
          <StatBox 
            label="REMAINING" 
            value={task.deadlineAt ? getTimeLeft(task.deadlineAt) : "--"} 
            highlight={task.slaStatus === "OVERDUE"}
          />
          <StatBox label="EFFORT" value={task.actualMinutes ? `${task.actualMinutes}m` : "0m"} />
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Timeline - Main Context */}
        <div className="md:col-span-2">
          <Card title="Extraction Timeline" color="rose">
            <TaskTimeline task={task} />
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="col-span-1">
          <Card title="Field Activity" color="dark">
            <TaskActivity taskId={task._id} />
          </Card>
        </div>

        {/* Comms Channel */}
        <div className="md:col-span-2">
          <Card title="Comms Channel" color="blue">
            <TaskComments taskId={task._id} />
          </Card>
        </div>

        {/* Intelligence Assets */}
        <div className="col-span-1">
          <Card title="Intelligence Assets" color="amber">
            <TaskFiles taskId={task._id} />
          </Card>
        </div>
      </div>

    </div>
  );
}

// 🔥 Tactical Stat Component
function StatBox({ label, value, color, highlight }: any) {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex flex-col justify-center">
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className={`text-lg font-black tracking-tight ${highlight ? 'text-rose-500 animate-pulse' : color || 'text-slate-800'}`}>
        {value || "N/A"}
      </p>
    </div>
  );
}

// 🔥 Modern Bento Card
function Card({ title, children, color }: any) {
  const accentColors: any = {
    rose: "bg-rose-500",
    dark: "bg-slate-900",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-xl shadow-slate-200/30 hover:shadow-2xl transition-all duration-300 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-1.5 h-6 ${accentColors[color]} rounded-full`} />
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">
          {title}
        </h2>
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}