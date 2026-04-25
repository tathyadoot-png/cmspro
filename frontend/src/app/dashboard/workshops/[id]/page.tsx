"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import PerformancePanel from "./components/PerformancePanel";
import WorkshopHeader from "./components/WorkshopHeader";
import WorkshopStats from "./components/WorkshopStats";
import MembersPanel from "./components/MembersPanel";
import ActivityPanel from "./components/ActivityPanel";
import TLPanel from "./components/TLPanel";
import CreateTaskPanel from "./components/CreateTaskPanel";
import TaskPanel from "./components/TaskPanel";
import ChatPanel from "./components/ChatPanel";

export default function WorkshopPage() {
  const params = useParams();
  const workshopId = params?.id;

  const [workshop, setWorkshop] = useState<any>(null);
  const [tab, setTab] = useState("members");
  const [activeCount, setActiveCount] = useState(0);

  const fetchWorkshop = async () => {
    try {
      const res = await api.get(`/workshops/${workshopId}`);
      setWorkshop(res.data.data);
    } catch (err) {
      console.error("Failed to load workshop", err);
    }
  };

  const fetchTaskCount = async () => {
    try {
      const res = await api.get("/tasks/my-active-count");
      setActiveCount(res.data.count);
    } catch (err) {
      console.error("Count error", err);
    }
  };

  useEffect(() => {
    if (!workshopId) return;
    fetchWorkshop();
    fetchTaskCount();
  }, [workshopId]);

  if (!workshop) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initializing Core...</p>
    </div>
  );

  const tabs = [
    { id: "members", label: "Team", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" },
    { id: "tasks", label: "Tasks", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id: "chat", label: "Chat", icon: "M8 10h.01M12 10h.01M16 10h.01M21 16a2 2 0 01-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z" },
    { id: "activity", label: "Log", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "performance", label: "Data", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  ];

  return (
    <>

  
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-rose-100 overflow-x-hidden">
      
      {/* 1. Elite Header Section */}
      <header className="bg-white border-b border-gray-100   pb-0 sticky top-0 z-30 shadow-sm md:static">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <WorkshopHeader workshop={workshop} activeCount={activeCount} />
          
          {/* Hide Stats on Mobile Header to save space, show in a clean grid */}
          <div className="hidden md:block mt-8">
            <WorkshopStats workshopId={workshopId} />
          </div>
  <div className="md:hidden px-4 mt-6">
         <WorkshopStats workshopId={workshopId} />
      </div>

          {/* 2. Custom Tab Bar - Horizontal but No Leakage */}
          <nav className="mt-6 flex items-center justify-between md:justify-start gap-1 md:gap-8 overflow-x-auto no-scrollbar py-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col md:flex-row items-center gap-1.5 md:gap-2.5 py-3 px-3 md:px-1 transition-all relative flex-shrink-0`}
              >
                <svg 
                  className={`w-5 h-5 md:w-4 md:h-4 ${tab === t.id ? 'text-rose-600' : 'text-slate-400'}`} 
                  fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                >
                  <path d={t.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-widest ${tab === t.id ? 'text-slate-900' : 'text-slate-400'}`}>
                  {t.label}
                </span>
                {tab === t.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 3. Stats - Grid View for Mobile Only (Visible on scroll) */}
      {/* <div className="md:hidden px-4 mt-6">
         <WorkshopStats workshopId={workshopId} />
      </div> */}

      {/* 4. Main Dynamic Stage */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-0  ">
        <div className="transition-all duration-500 ease-out">
          
          {tab === "members" && (
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TLPanel workshopId={workshopId} />
              </div>
              <div className="lg:col-span-2">
                <MembersPanel workshopId={workshopId} workshop={workshop} />
              </div>
            </div>
          )}

          {tab === "tasks" && <TaskPanel workshopId={workshopId} />}
          {tab === "performance" && <PerformancePanel workshopId={workshopId} />}
          {tab === "activity" && <ActivityPanel workshopId={workshopId} />}
          {tab === "chat" && <ChatPanel workshopId={workshopId} />}
          {tab === "createTask" && <CreateTaskPanel workshop={workshop} />}
        </div>
      </main>

      {/* 5. Mobile FAB (Deploy Task) - Creativity Here */}
      <button 
        onClick={() => setTab("createTask")}
        className={`fixed md:bottom-3 md:px-20 bottom-6 left-1/2 -translate-x-1/2 z-50  flex items-center gap-3 px-4 py-2 rounded-full shadow-[0_20px_40px_rgba(225,29,72,0.3)] transition-all active:scale-95 ${tab === "createTask" ? 'bg-slate-900 text-white' : 'bg-rose-600 text-white'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span className="text-[11px] font-black uppercase tracking-widest">Deploy</span>
      </button>

      {/* 6. System Status Toast - Mobile Optimized */}
      <div className="hidden md:flex fixed bottom-6 right-8 z-50">
        <div className="bg-[#1A1A1A] px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black text-white uppercase tracking-widest">
            {workshop.workshopCode} // Online
          </span>
        </div>
      </div>
    </div>
    </>
  );
}