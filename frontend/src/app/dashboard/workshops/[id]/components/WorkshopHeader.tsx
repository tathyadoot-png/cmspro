"use client";

export default function WorkshopHeader({ workshop, activeCount }: any) {

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
    <div className="relative mb-4 md:mb-10 overflow-hidden">
      {/* Glow Effect - Smaller on mobile */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-rose-500/5 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-3">
        
        {/* Top Row: Title + Status (Mobile Friendly) */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 md:h-6 bg-rose-600 rounded-full" />
              <p className="text-[8px] md:text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] md:tracking-[0.4em]">
                Workshop
              </p>
            </div>
            <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
              {workshop.workshopName}
            </h1>
          </div>

          {/* Status Badge - Fixed size for mobile */}
          <div className="flex flex-col items-end shrink-0">
             <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border font-black text-[9px] md:text-[11px] uppercase tracking-wider transition-all shadow-sm ${getStatusColor(workshop.status)}`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
              </span>
              {workshop.status || "UNKNOWN"}
            </div>
          </div>
        </div>

        {/* Bottom Row: Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="bg-[#1A1A1A] px-2.5 py-1 rounded-md shadow-md">
            <p className="text-[9px] md:text-[11px] font-black text-white tracking-widest uppercase">
              {workshop.workshopCode}
            </p>
          </div>
          
          <div className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[9px] md:text-xs font-black uppercase tracking-wide flex items-center gap-1.5 border border-amber-100/50">
            <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            {activeCount} Tasks
          </div>

          <p className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            Instance Managed
          </p>
        </div>
      </div>

      {/* Sleek Line */}
      <div className="mt-5 h-[1px] w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />
    </div>
  );
}