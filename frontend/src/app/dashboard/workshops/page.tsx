// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { api } from "@/lib/api";

// export default function WorkshopsPage() {

//   const [workshops, setWorkshops] = useState<any[]>([]);

//   useEffect(() => {
//     fetchWorkshops();
//   }, []);

//   const fetchWorkshops = async () => {
//     const res = await api.get("/workshops");
//     setWorkshops(res.data.data || []);
//   };

//   return (
//     <div className="p-6">

//       <div className="flex justify-between items-center mb-6">

//         <h1 className="text-2xl font-bold">
//           Workshops
//         </h1>

//         <Link
//           href="/dashboard/workshops/create"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Create Workshop
//         </Link>

//       </div>

//       {workshops.length === 0 && (
//         <div className="text-gray-500">
//           No workshops yet
//         </div>
//       )}

//       <div className="grid grid-cols-3 gap-4">

//         {workshops.map((w) => (

//           <Link
//             key={w._id}
//             href={`/dashboard/workshops/${w._id}`}
//             className="border rounded-lg p-4 hover:bg-gray-100"
//           >

//             <h2 className="font-semibold text-lg">
//               {w.workshopName}
//             </h2>

//          <p className="text-sm text-gray-500">
//   {w.workshopCode}
// </p>

// <p className="text-sm text-gray-500">
//   Members: {w.members?.length || 0}
// </p>

//           </Link>

//         ))}

//       </div>

//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<any[]>([]);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const res = await api.get("/workshops");
      setWorkshops(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE FUNCTION
  const deleteWorkshop = async (id: string) => {
    try {
      const confirmDelete = confirm("Are you sure you want to delete this workshop?");
      if (!confirmDelete) return;

      await api.delete(`/workshops/${id}`);
      fetchWorkshops(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto min-h-screen bg-[#FDFDFD]">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 md:mb-16">
        <div className="relative pl-4 md:pl-0">
          <div className="absolute left-0 md:-left-4 top-0 w-1 h-full bg-rose-500 rounded-full" />
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tightest leading-none">
            WORK<span className="text-rose-600">SHOPS</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4">
            <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-tighter rounded">
              PRO
            </span>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] md:tracking-[0.4em]">
              Operational Environment Selection
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/workshops/create"
          className="w-full md:w-auto group relative overflow-hidden bg-[#1A1A1A] text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-[11px] md:text-[12px] uppercase tracking-[0.2em] transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-gray-300 text-center"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-xl leading-none">+</span> Create New Unit
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
        {workshops.map((w, index) => (
          <div
            key={w._id}
            className="group relative flex flex-col justify-between min-h-[280px] md:min-h-[320px] bg-white border border-slate-100 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] transition-all duration-700 hover:border-rose-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] overflow-hidden"
          >

            {/* 🔗 Full clickable layer */}
            <Link
              href={`/dashboard/workshops/${w._id}`}
              className="absolute inset-0 z-10"
            />

            {/* ✏️ EDIT + DELETE */}
            <div className="absolute top-0 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              
              <Link
                href={`/dashboard/workshops/edit/${w._id}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border border-gray-200 hover:bg-rose-500 hover:text-white text-gray-600 p-2 rounded-full shadow-md transition"
              >
                ✏️
              </Link>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteWorkshop(w._id);
                }}
                className="bg-white border border-gray-200 hover:bg-red-500 hover:text-white text-gray-600 p-2 rounded-full shadow-md transition"
              >
                🗑️
              </button>
            </div>

            {/* Background Number */}
            <span className="absolute -right-4 -top-4 md:-top-8 text-[120px] md:text-[180px] font-black text-slate-50 opacity-[0.03] group-hover:text-rose-500 group-hover:opacity-[0.05] transition-all duration-700 pointer-events-none">
              0{index + 1}
            </span>

            <div className="relative z-0">
              <div className="flex justify-between items-start mb-6 md:mb-10">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 group-hover:rotate-[10deg]">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="md:w-[28px] md:h-[28px]">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round"/>
                  </svg>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[9px] md:text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    Open Unit
                  </span>
                </div>
              </div>

             <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tightest group-hover:translate-x-2 transition-transform duration-500">
    {w.clientId?.name || "No Client"}
</h2>

<p className="text-md text-gray-500 mt-1">

   {w.workshopName}
</p>

              <div className="mt-3 md:mt-4 flex items-center gap-3 md:gap-4">
                <div className="h-[1px] w-6 md:w-8 bg-slate-200 group-hover:w-16 group-hover:bg-rose-500 transition-all duration-500" />
                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                  {w.workshopCode}
                </span>
              </div>
            </div>

            <div className="relative z-0 mt-8 md:mt-12 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Personnel
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-xl font-black text-slate-900">
                    {w.members?.length || 0}
                  </span>
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Active Members
                  </span>
                </div>
              </div>

              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="md:w-[20px] md:h-[20px]">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {workshops.length === 0 && (
        <div className="bg-[#1A1A1A] rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 text-center border border-white/5 mt-10">
          <p className="text-rose-500 font-mono text-xs md:text-sm mb-4 tracking-tighter">
            {"> SYSTEM_SCAN: NO_DATA_FOUND"}
          </p>
          <h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-widest">
            Initialization Required
          </h2>
          <p className="text-gray-500 text-[10px] md:text-xs mt-4 max-w-md mx-auto leading-relaxed">
            Please create your first operational workshop unit to begin data synchronization and team management.
          </p>
        </div>
      )}

    </div>
  );
}