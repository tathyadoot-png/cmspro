// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { api } from "@/lib/api";
// import PerformancePanel from "./components/PerformancePanel";
// import WorkshopHeader from "./components/WorkshopHeader";
// import WorkshopStats from "./components/WorkshopStats";
// import MembersPanel from "./components/MembersPanel";
// import ActivityPanel from "./components/ActivityPanel";
// import TLPanel from "./components/TLPanel";
// import CreateTaskPanel from "./components/CreateTaskPanel";
// import TaskPanel from "./components/TaskPanel";
// export default function WorkshopPage() {

//   const params = useParams();
//   const workshopId = params?.id;

//   const [workshop, setWorkshop] = useState<any>(null);
//   const [tab, setTab] = useState("members");

//   useEffect(() => {
//     fetchWorkshop();
//   }, []);

//   const fetchWorkshop = async () => {

//     const res = await api.get(`/workshops/${workshopId}`);

//     setWorkshop(res.data.data);

//   };

//   if (!workshop) return <div>Loading...</div>;

//   return (

//     <div className="p-6 space-y-6">

//       <WorkshopHeader workshop={workshop} />

//       <WorkshopStats workshopId={workshopId} />

//       {/* Tabs */}

//       <div className="flex gap-4 border-b pb-2">

//         <button onClick={()=>setTab("members")}>Members</button>
//         <button onClick={()=>setTab("tasks")}>Tasks</button>
//         <button onClick={()=>setTab("activity")}>Activity</button>
// <button onClick={()=>setTab("performance")}>
//   Performance
// </button>

// <button onClick={()=>setTab("createTask")}>
// Create Task
// </button>
//       </div>

//       {tab === "members" && (
// <MembersPanel workshopId={workshopId} workshop={workshop} />
//       )}
// {tab === "performance" && (
//   <PerformancePanel workshopId={workshopId} />
// )}
// {tab === "activity" && (
//   <ActivityPanel workshopId={workshopId} />
// )}
// {tab === "teamlead" && (
//   <TLPanel workshopId={workshopId} />
// )}
// {tab === "createTask" && (
// <CreateTaskPanel workshop={workshop} />)}
// {tab === "tasks" && (
//   <TaskPanel workshopId={workshopId} />
// )}
//     </div>

//   );

// }



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

export default function WorkshopPage() {
  const params = useParams();
  const workshopId = params?.id;

  const [workshop, setWorkshop] = useState<any>(null);
  const [tab, setTab] = useState("members");

  useEffect(() => {
    if (workshopId) fetchWorkshop();
  }, [workshopId]);

  const fetchWorkshop = async () => {
    try {
      const res = await api.get(`/workshops/${workshopId}`);
      setWorkshop(res.data.data);
    } catch (err) {
      console.error("Failed to load workshop", err);
    }
  };

  if (!workshop) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Environment...</p>
    </div>
  );

  const tabs = [
    { id: "members", label: "Members", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" },
    { id: "tasks", label: "Task Panel", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id: "activity", label: "Operations Log", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "performance", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { id: "createTask", label: "Deploy Task", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Top Section */}
      <div className="bg-white border-b border-gray-100 px-8 pt-10 pb-2">
        <WorkshopHeader workshop={workshop} />
        
        <div className="mt-8 overflow-x-auto no-scrollbar">
          <WorkshopStats workshopId={workshopId} />
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="flex gap-8 mt-10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-4 px-1 flex items-center gap-2.5 transition-all relative group`}
            >
              <svg 
                className={`w-4 h-4 ${tab === t.id ? 'text-rose-600' : 'text-slate-400 group-hover:text-slate-600'}`} 
                fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
              >
                <path d={t.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${tab === t.id ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {t.label}
              </span>
              
              {/* Active Underline */}
              {tab === t.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-600 rounded-t-full shadow-[0_-4px_10px_rgba(225,29,72,0.3)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {tab === "members" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <MembersPanel workshopId={workshopId} workshop={workshop} />
              </div>
              <div className="lg:col-span-1">
                <TLPanel workshopId={workshopId} />
              </div>
            </div>
          )}

          {tab === "tasks" && (
            <div className="w-full overflow-hidden">
               <TaskPanel workshopId={workshopId} />
            </div>
          )}

          {tab === "performance" && <PerformancePanel workshopId={workshopId} />}
          
          {tab === "activity" && (
             <div className="max-w-4xl mx-auto">
                <ActivityPanel workshopId={workshopId} />
             </div>
          )}

          {tab === "createTask" && (
            <div className="max-w-2xl mx-auto">
              <CreateTaskPanel workshop={workshop} />
            </div>
          )}
        </div>
      </div>

      {/* Footer System Info */}
      <div className="fixed bottom-6 right-8 pointer-events-none">
        <div className="bg-[#1A1A1A] px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">System Online: {workshop.workshopCode}</span>
        </div>
      </div>
    </div>
  );
}