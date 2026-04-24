"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function WorkshopStats({ workshopId }: any) {
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const res = await api.get(`/workshops/${workshopId}/stats`);
      setStats(res.data.data);
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const handler = () => fetchStats();
    window.addEventListener("TASK_UPDATED", handler);
    return () => window.removeEventListener("TASK_UPDATED", handler);
  }, [workshopId]);

  if (!stats) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-5 gap-1.5 md:gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 md:h-32 w-full bg-slate-50 animate-pulse rounded-lg md:rounded-[2.5rem]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-1.5 md:gap-6">
      <Stat title="Total" value={stats.totalTasks} subtitle="Scope" />
      <Stat title="Done" value={stats.completed} subtitle="Final" variant="rose" />
      <Stat title="Active" value={stats.inProgress} subtitle="Live" />
      <Stat title="Overdue" value={stats.overdue} subtitle="Urgent" isAlert={stats.overdue > 0} />
      <Stat title="Staff" value={stats.members} subtitle="Users" />
    </div>
  );
}

function Stat({ title, value, subtitle, variant, isAlert }: any) {
  return (
    <div className="group relative bg-white border border-slate-100 p-2 md:p-8 rounded-xl md:rounded-[2.5rem] shadow-sm overflow-hidden h-full">
      
      {/* Background Accent */}
      <div className={`absolute top-0 right-0 w-6 h-6 md:w-24 md:h-24 -mr-1 -mt-1 rounded-full blur-lg opacity-10 ${
        variant === 'rose' || isAlert ? 'bg-rose-500' : 'bg-slate-400'
      }`} />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <p className="text-[6px] md:text-[9px] font-black text-slate-400 uppercase tracking-tighter md:tracking-widest truncate">
            {title}
          </p>
          
          <div className="flex items-baseline">
            <p className={`text-base md:text-4xl font-black tracking-tighter ${
              isAlert ? 'text-rose-600' : 'text-slate-900'
            }`}>
              {value < 10 && value > 0 ? `0${value}` : value}
            </p>
          </div>
        </div>

        <p className="text-[5px] md:text-[8px] font-bold text-slate-300 uppercase tracking-tighter pt-1 border-t border-slate-50 mt-1 truncate">
          {subtitle}
        </p>
      </div>

      {/* Logic Line */}
      <div className={`absolute bottom-0 left-0 h-0.5 transition-all duration-500 ${
        isAlert ? 'w-full bg-rose-600' : 'w-0 group-hover:w-full bg-slate-900'
      }`} />
    </div>
  );
}