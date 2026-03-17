// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function PerformancePanel({ workshopId }: any) {

//   const [users, setUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (workshopId) {
//       fetchPerformance();
//     }
//   }, [workshopId]);

//   const fetchPerformance = async () => {
//     try {
//       setLoading(true);

//       const res = await api.get(
//         `/performancee/workshop/${workshopId}`
//       );

//       setUsers(res.data.data || []);

//     } catch (error) {
//       console.error("Performance fetch error", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <p className="text-sm">Loading...</p>;
//   }

//   if (users.length === 0) {
//     return (
//       <div className="text-sm text-gray-500">
//         No performance data
//       </div>
//     );
//   }

//   // 🔥 Sort for leaderboard
//   const sortedUsers = [...users].sort(
//     (a, b) => b.completedTasks - a.completedTasks
//   );

//   return (

//     <div className="space-y-6">

//       {/* 🔥 LEADERBOARD */}

//       <div className="border rounded-lg p-4">

//         <h2 className="font-semibold mb-3">
//           🏆 Leaderboard
//         </h2>

//         <div className="space-y-2">

//           {sortedUsers.slice(0, 5).map((u, i) => (

//             <div
//               key={u.userId}
//               className="flex justify-between border-b pb-2"
//             >

//               <span>
//                 #{i + 1} {u.name}
//               </span>

//               <span className="font-semibold">
//                 {u.completedTasks} tasks
//               </span>

//             </div>

//           ))}

//         </div>

//       </div>

//       {/* 🔥 GRAPH */}

//       <div className="border rounded-lg p-4">

//         <h2 className="font-semibold mb-3">
//           📊 Performance Graph
//         </h2>

//         <div className="w-full h-64">

//           <ResponsiveContainer width="100%" height="100%">

//             <BarChart data={users}>

//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />

//               <Bar dataKey="completedTasks" />
//               <Bar dataKey="lateTasks" />

//             </BarChart>

//           </ResponsiveContainer>

//         </div>

//       </div>

//       {/* 🔥 USER CARDS */}

//       <div className="space-y-3">

//         {users.map((u: any) => (

//           <div
//             key={u.userId}
//             className="border rounded-lg p-4 flex justify-between"
//           >

//             <div>

//               <p className="font-semibold">
//                 {u.name}
//               </p>

//               <p className="text-xs text-gray-500">
//                 Completed: {u.completedTasks}
//               </p>

//               <p className="text-xs text-gray-500">
//                 Late: {u.lateTasks}
//               </p>

//               <p className="text-xs text-gray-500">
//                 Avg Time: {u.avgMinutes} min
//               </p>

//             </div>

//             <div className="font-semibold">
//               {u.ratingTag}
//             </div>

//           </div>

//         ))}

//       </div>

//     </div>

//   );

// }



"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

export default function PerformancePanel({ workshopId }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workshopId) {
      fetchPerformance();
    }
  }, [workshopId]);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/performancee/workshop/${workshopId}`);
      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Performance fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-gray-50 rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No performance metrics detected</p>
      </div>
    );
  }

  const sortedUsers = [...users].sort((a, b) => b.completedTasks - a.completedTasks);

  return (
    <div className="space-y-10 max-w-5xl mx-auto p-2">
      
      {/* --- TOP SECTION: LEADERBOARD & STATS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEADERBOARD CARD */}
        <div className="lg:col-span-1 bg-[#1A1A1A] rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-6 opacity-10">
             <svg width="60" height="60" fill="white" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
          </div>
          
          <h2 className="text-white text-xl font-black tracking-tight mb-8 flex items-center gap-3">
            <span className="text-rose-500">🏆</span> Top Fleet
          </h2>

          <div className="space-y-5">
            {sortedUsers.slice(0, 5).map((u, i) => (
              <div key={u.userId} className="flex items-center justify-between group/item transition-all hover:translate-x-1">
                <div className="flex items-center gap-4">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-rose-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-gray-200 group-hover/item:text-rose-400 transition-colors">{u.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-white">{u.completedTasks}</p>
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter text-nowrap">Units Done</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PERFORMANCE GRAPH */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-slate-900 text-lg font-black tracking-tight flex items-center gap-3">
               <span className="text-rose-500">📊</span> Efficiency Analytics
             </h2>
             <div className="flex gap-4">
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-900" /><span className="text-[9px] font-black text-gray-400 uppercase">Completed</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-[9px] font-black text-gray-400 uppercase">Late</span></div>
             </div>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={users} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="completedTasks" fill="#1A1A1A" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="lateTasks" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- USER PERFORMANCE CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map((u: any) => (
          <div 
            key={u.userId} 
            className="group bg-white border border-gray-100 p-8 rounded-[2.5rem] flex justify-between items-center transition-all hover:shadow-2xl hover:shadow-rose-100/50 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors">{u.name}</h3>
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Personnel ID: {u.userId.slice(-6)}</span>
              </div>
              
              <div className="flex gap-6">
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Success</p>
                  <p className="text-sm font-black text-slate-800">{u.completedTasks}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Delays</p>
                  <p className="text-sm font-black text-rose-500">{u.lateTasks}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Avg Time</p>
                  <p className="text-sm font-black text-slate-800">{u.avgMinutes}m</p>
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-3">
              <div className="px-4 py-2 bg-slate-50 rounded-2xl group-hover:bg-rose-500 transition-colors">
                <span className="text-[10px] font-black text-slate-900 group-hover:text-white uppercase tracking-widest leading-none">
                  {u.ratingTag}
                </span>
              </div>
              {/* Progress mini bar */}
              <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500" 
                  style={{ width: `${Math.min((u.completedTasks / (u.completedTasks + u.lateTasks || 1)) * 100, 100)}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}