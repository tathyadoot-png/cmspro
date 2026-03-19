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

  const fetchStats = async () => {
    try {
      const res = await api.get(`/workshops/${workshopId}/stats`);
      setStats(res.data.data);
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  // 🔥 Logic and Event Listeners remain untouched as requested
  useEffect(() => {
    fetchStats();

    const handler = () => {
      fetchStats();
    };

    window.addEventListener("TASK_UPDATED", handler);

    return () => {
      window.removeEventListener("TASK_UPDATED", handler);
    };
  }, [workshopId]);

  if (!stats) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 w-full bg-gray-100 animate-pulse rounded-[2rem]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <Stat 
        title="Total Nodes" 
        value={stats.totalTasks} 
        subtitle="Deployment Scope" 
      />
      <Stat 
        title="Completed" 
        value={stats.completed} 
        subtitle="Finalized Units" 
        variant="rose" 
      />
      <Stat 
        title="In Progress" 
        value={stats.inProgress} 
        subtitle="Active Operations" 
      />
      <Stat 
        title="Overdue" 
        value={stats.overdue} 
        subtitle="Urgent Attention" 
        isAlert={stats.overdue > 0} 
      />
      <Stat 
        title="Members" 
        value={stats.members} 
        subtitle="Authenticated Personnel" 
      />
    </div>
  );
}

function Stat({ title, value, subtitle, variant, isAlert }: any) {
  return (
    <div className="group relative bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.04)] transition-all duration-500 overflow-hidden">
      
      {/* Visual Accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-10 transition-opacity ${
        variant === 'rose' || isAlert ? 'bg-rose-600' : 'bg-slate-900'
      }`} />

      <div className="relative z-10 space-y-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {title}
        </p>
        
        <div className="flex items-baseline gap-1">
          <p className={`text-4xl font-black tracking-tighter transition-colors ${
            isAlert ? 'text-rose-600' : 'text-slate-900'
          }`}>
            {value < 10 && value > 0 ? `0${value}` : value}
          </p>
        </div>

        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight italic pt-2 border-t border-gray-50">
          {subtitle}
        </p>
      </div>

      {/* Interactive Bottom Bar */}
      <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${
        isAlert ? 'w-full bg-rose-600' : 'w-0 group-hover:w-full bg-slate-900'
      }`} />
    </div>
  );
}