"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AnalyticsPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    // API integration remains exactly as you provided
    const res = await api.get("/analytics/leaderboard");
    setUsers(res.data.data || []);
  };

  // Max tasks nikalne ke liye taaki bars proportional rahein
  const maxTasks = Math.max(...users.map(u => u.completedTasks || 1), 1);

  return (
    <div className="p-10 max-w-[1600px] mx-auto min-h-screen bg-[#FDFDFD] space-y-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-rose-500 rounded-full" />
          <h1 className="text-5xl font-black text-slate-900 tracking-tightest leading-none uppercase">
            Performance<span className="text-rose-600">Analytics</span>
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-tighter rounded">PRO MODE</span>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.4em]">
              Real-time Task Telemetry
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Leaderboard Table (Left) */}
        <div className="xl:col-span-7">
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="bg-[#1A1A1A] px-10 py-7 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-lg font-black text-white tracking-tight uppercase">Leaderboard Ranking</h2>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Live</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                    <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-rose-50/20 transition-all group">
                      <td className="px-10 py-6">
                        <span className={`text-xl font-black ${i === 0 ? 'text-rose-600' : 'text-slate-300 group-hover:text-slate-900'}`}>
                          {i < 9 ? `0${i + 1}` : i + 1}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-gray-100 flex items-center justify-center text-[11px] font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{u.name}</p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Verified Unit</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-sm font-black text-slate-700">{u.performanceScore}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-all ${
                          i === 0 ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-white text-slate-400 border border-gray-100'
                        }`}>
                          {u.ratingTag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Custom Visual Productivity Chart (Right) */}
        <div className="xl:col-span-5">
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-rose-600 rounded-full" />
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Task Distribution</h2>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Metrics</span>
            </div>

            {/* Custom Bar Graph using pure Tailwind */}
            <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
              {users.map((u) => (
                <div key={u._id} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight group-hover:text-rose-600 transition-colors">
                      {u.name}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {u.completedTasks} Tasks
                    </p>
                  </div>
                  <div className="relative h-3 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-slate-900 to-rose-600 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                      style={{ width: `${(u.completedTasks / maxTasks) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Stats inside Analytics */}
            <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-[2rem] border border-gray-100">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Effort</p>
                <p className="text-2xl font-black text-slate-900">
                  {users.reduce((acc, curr) => acc + (curr.completedTasks || 0), 0)}
                </p>
              </div>
              <div className="bg-rose-50/50 p-5 rounded-[2rem] border border-rose-100">
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">Peak Performance</p>
                <p className="text-2xl font-black text-rose-600">{maxTasks}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}