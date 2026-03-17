// "use client";

// import { useEffect,useState } from "react";
// import { api } from "@/lib/api";

// export default function TeamDashboard(){

//   const [data,setData] = useState<any>(null);

//   useEffect(()=>{
//     fetchData();
//   },[]);

//   const fetchData = async ()=>{

//     const res = await api.get(
//       "/analytics/team"
//     );

//     setData(res.data.data);

//   };

//   if(!data) return <div>Loading...</div>;

//   return(

//     <div className="space-y-6">

//       <h1 className="text-xl font-semibold">
//         Team Dashboard
//       </h1>

//       {/* CARDS */}

//       <div className="grid grid-cols-5 gap-4">

//         <Card title="Total Tasks" value={data.totalTasks}/>
//         <Card title="Completed" value={data.completedTasks}/>
//         <Card title="In Progress" value={data.inProgressTasks}/>
//         <Card title="Overdue" value={data.overdueTasks}/>
//         <Card title="Burnout Risk" value={data.burnoutUsers}/>

//       </div>

//       {/* TOP USER */}

//       <div className="border p-4 rounded">

//         <h2 className="font-semibold mb-2">
//           Top Performer
//         </h2>

//         <p>{data.topUser?.name}</p>

//         <p className="text-sm text-gray-500">
//           Score: {data.topUser?.performanceScore}
//         </p>

//         <p className="text-sm">
//           {data.topUser?.ratingTag}
//         </p>

//       </div>

//     </div>

//   );

// }

// function Card({title,value}:any){

//   return(

//     <div className="border p-4 rounded">

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

export default function TeamDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/analytics/team");
      setData(res.data.data);
    } catch (err) {
      console.error("Team analytics fetch error:", err);
    }
  };

  if (!data) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-10">
      
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em]">Operations</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Team Dashboard</h1>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
          <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">System Synchronized</p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <StatCard title="Total Tasks" value={data.totalTasks} variant="dark" />
        <StatCard title="Completed" value={data.completedTasks} variant="emerald" />
        <StatCard title="In Progress" value={data.inProgressTasks} variant="blue" />
        <StatCard title="Overdue" value={data.overdueTasks} variant="rose" isSerious={data.overdueTasks > 0} />
        <StatCard title="Burnout Risk" value={data.burnoutUsers} variant="amber" isSerious={data.burnoutUsers > 0} />
      </div>

      {/* PERFORMANCE FOCUS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TOP PERFORMER CARD */}
        <div className="lg:col-span-1 bg-[#1A1A1A] rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl shadow-gray-900/20">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
             <svg width="100" height="100" fill="white" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Top Performer</span>
            </div>

            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter mb-1">
                {data.topUser?.name || "N/A"}
              </h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Personnel ID: {data.topUser?._id?.slice(-6) || '---'}</p>
            </div>

            <div className="flex gap-8 border-t border-white/5 pt-6">
              <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Score</p>
                <p className="text-xl font-black text-rose-500 italic">{data.topUser?.performanceScore || 0}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Rank</p>
                <p className="text-xl font-black text-white tracking-widest">{data.topUser?.ratingTag || "Standard"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder for other analytics / Quick Logs */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 flex items-center justify-center border-dashed">
            <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.4em]">Additional Metrics Coming Soon</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, variant, isSerious }: any) {
  const themes: any = {
    dark: "bg-[#1A1A1A] text-white",
    emerald: "bg-white border-gray-100 text-emerald-600",
    blue: "bg-white border-gray-100 text-blue-600",
    rose: "bg-white border-gray-100 text-rose-600",
    amber: "bg-white border-gray-100 text-amber-600",
  };

  return (
    <div className={`p-6 rounded-[2.2rem] border transition-all hover:shadow-xl hover:-translate-y-1 duration-300 ${themes[variant]}`}>
      <div className="flex items-center gap-2 mb-2">
        <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${variant === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
          {title}
        </p>
        {isSerious && (
          <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <p className={`text-3xl font-black tracking-tighter ${variant === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {value}
        </p>
        <span className="text-[9px] font-bold text-gray-400 uppercase italic tracking-tighter">Units</span>
      </div>
    </div>
  );
}