"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function UserDashboard() {
  const params = useParams();
  const userId = params?.id;

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // API integration remains exactly as provided
    const res = await api.get(`/users/${userId}/stats`);
    setStats(res.data.data);
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Decrypting Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-[1400px] mx-auto min-h-screen space-y-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-rose-500 rounded-full" />
          <h1 className="text-5xl font-black text-slate-900 tracking-tightest leading-none uppercase">
            User<span className="text-rose-600">Performance</span>
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-tighter rounded">Live Stats</span>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.4em]">
              Operator ID: {userId?.toString().substring(0, 8) || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Completed Tasks", value: stats.tasksCompleted, color: "rose", desc: "Total successfully closed" },
          { label: "In Progress", value: stats.tasksInProgress, color: "slate", desc: "Active operational units" },
          { label: "Pending", value: stats.tasksPending, color: "gray", desc: "Awaiting initialization" },
        ].map((stat, idx) => (
          <div 
            key={idx}
            className="group relative bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity bg-${stat.color}-600`} />
            
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">
              {stat.value}
            </h3>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight italic">
              {stat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* ACTIVITY FEED SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="bg-[#1A1A1A] px-10 py-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-white tracking-tight uppercase">Activity Stream</h2>
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-0.5">Chronological Operations Log</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-rose-500">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="p-10 space-y-8 max-h-[600px] overflow-y-auto custom-scrollbar">
              {stats.activities.map((a: any, index: number) => (
                <div key={a._id} className="relative pl-8 group">
                  {/* Vertical Timeline Line */}
                  {index !== stats.activities.length - 1 && (
                    <div className="absolute left-[11px] top-6 w-[2px] h-[calc(100%+2rem)] bg-gray-100 group-hover:bg-rose-100 transition-colors" />
                  )}
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white bg-slate-900 shadow-sm group-hover:bg-rose-600 transition-colors z-10" />

                  <div className="bg-gray-50/50 group-hover:bg-white border border-gray-100 group-hover:border-rose-100 p-6 rounded-3xl transition-all duration-300 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                    <p className="text-sm font-bold text-slate-800 leading-relaxed mb-3">
                      {a.message}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest px-2 py-1 bg-rose-50 rounded">
                        {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        {new Date(a.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Context Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-600 rounded-full blur-[80px] opacity-30" />
            
            <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4">Summary Report</h4>
            <p className="text-2xl font-black leading-tight tracking-tight mb-6">
              User maintains a <span className="text-rose-500">{((stats.tasksCompleted / (stats.tasksCompleted + stats.tasksInProgress + stats.tasksPending || 1)) * 100).toFixed(0)}%</span> completion efficiency rate.
            </p>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-600 transition-all duration-1000" 
                style={{ width: `${(stats.tasksCompleted / (stats.tasksCompleted + stats.tasksInProgress + stats.tasksPending || 1)) * 100}%` }} 
              />
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Operational Readiness</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase">Active Duty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}