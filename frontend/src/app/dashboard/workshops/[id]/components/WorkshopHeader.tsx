// export default function WorkshopHeader({ workshop }: any) {

//   return (

//     <div className="flex justify-between items-center">

//       <div>

//         <h1 className="text-2xl font-bold">
//           {workshop.workshopName}
//         </h1>

//         <p className="text-sm text-gray-500">
//           {workshop.workshopCode}
//         </p>

//       </div>

//       <div>

//         <span className="text-sm">
//           Status: {workshop.status}
//         </span>

//       </div>

//     </div>

//   );

// }


"use client";

export default function WorkshopHeader({ workshop }: any) {
  // Dynamic status color logic
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "COMPLETED": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "ON_HOLD": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  if (!workshop) return null;

  return (
    <div className="relative mb-10 overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        
        {/* Left Side: Identity */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-8 bg-rose-600 rounded-full" />
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em]">
              Workshop Environment
            </p>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
            {workshop.workshopName}
          </h1>
          
          <div className="flex items-center gap-3 pt-2">
            <div className="bg-[#1A1A1A] px-3 py-1 rounded-lg shadow-lg">
              <p className="text-[11px] font-black text-white tracking-[0.15em] uppercase">
                {workshop.workshopCode}
              </p>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Managed Workshop Instance
            </p>
          </div>
        </div>

        {/* Right Side: Quick Stats & Status */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current State</p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border font-black text-[11px] uppercase tracking-[0.1em] transition-all shadow-sm ${getStatusColor(workshop.status)}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
              </span>
              {workshop.status || "UNKNOWN"}
            </div>
          </div>

          {/* Action Trigger Decor */}
          {/* <div className="w-14 h-14 rounded-3xl bg-white border border-slate-100 shadow-xl flex items-center justify-center group cursor-pointer hover:border-rose-500 transition-all duration-500">
            <svg 
              className="text-slate-400 group-hover:text-rose-600 group-hover:rotate-12 transition-all" 
              width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
            >
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div> */}
        </div>
      </div>

      {/* Modern Underline Separator */}
      <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />
    </div>
  );
}