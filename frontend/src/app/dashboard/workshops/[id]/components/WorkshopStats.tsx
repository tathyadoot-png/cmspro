// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";

// export default function WorkshopStats({ workshopId }: any) {

//   const [stats, setStats] = useState<any>(null);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {

//     const res = await api.get(`/workshops/${workshopId}/stats`);

//     setStats(res.data.data);

//   };

//   if (!stats) return null;

//   return (

//     <div className="grid grid-cols-5 gap-4">

//       <Card title="Total Tasks" value={stats.totalTasks} />
//       <Card title="Completed" value={stats.completed} />
//       <Card title="In Progress" value={stats.inProgress} />
//       <Card title="Overdue" value={stats.overdue} />
//       <Card title="Members" value={stats.members} />

//     </div>

//   );

// }

// function Card({ title, value }: any) {

//   return (

//     <div className="border rounded-lg p-4">

//       <p className="text-sm text-gray-500">
//         {title}
//       </p>

//       <p className="text-xl font-bold">
//         {value}
//       </p>

//     </div>

//   );

// }



"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function WorkshopStats({ workshopId }: any) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, [workshopId]);

  const fetchStats = async () => {
    try {
      const res = await api.get(`/workshops/${workshopId}/stats`);
      setStats(res.data.data);
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  if (!stats) return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-100 rounded-[2rem]" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard 
        title="Total Tasks" 
        value={stats.totalTasks} 
        variant="dark" 
      />
      <StatCard 
        title="Completed" 
        value={stats.completed} 
        variant="emerald" 
      />
      <StatCard 
        title="In Progress" 
        value={stats.inProgress} 
        variant="blue" 
      />
      <StatCard 
        title="Overdue" 
        value={stats.overdue} 
        variant="rose" 
        isWarning={stats.overdue > 0}
      />
      <StatCard 
        title="Members" 
        value={stats.members} 
        variant="amber" 
      />
    </div>
  );
}

function StatCard({ title, value, variant, isWarning }: any) {
  const variants: any = {
    dark: "bg-[#1A1A1A] text-white shadow-xl shadow-gray-200",
    emerald: "bg-white border border-gray-100 text-emerald-600",
    blue: "bg-white border border-gray-100 text-blue-600",
    rose: "bg-white border border-gray-100 text-rose-600",
    amber: "bg-white border border-gray-100 text-amber-600",
  };

  return (
    <div className={`${variants[variant]} p-6 rounded-[2.5rem] relative overflow-hidden transition-all hover:scale-[1.02] duration-300`}>
      {/* Background Decor */}
      <div className="absolute -right-2 -bottom-2 opacity-[0.03] pointer-events-none">
        <p className="text-6xl font-black italic uppercase tracking-tighter">{title.charAt(0)}</p>
      </div>

      <div className="relative z-10 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          {isWarning && (
            <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
          )}
          <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${variant === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
            {title}
          </p>
        </div>
        
        <div className="flex items-baseline gap-1">
          <p className={`text-3xl font-black tracking-tighter ${variant === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {value}
          </p>
          <span className={`text-[10px] font-bold ${variant === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}>Units</span>
        </div>
      </div>

      {/* Subtle Progress Bar Decoration */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-50/10">
        <div 
          className={`h-full opacity-30 ${variant === 'dark' ? 'bg-rose-600' : 'bg-current'}`} 
          style={{ width: '40%' }} 
        />
      </div>
    </div>
  );
}