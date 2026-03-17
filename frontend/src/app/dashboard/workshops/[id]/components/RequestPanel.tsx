"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function RequestPanel({ workshopId }: any) {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get(`/requests/workshop/${workshopId}`);
      setRequests(res.data.data || []);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  // Helper to color code statuses
  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING": return "bg-amber-50 text-amber-600 border-amber-100";
      case "APPROVED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "REJECTED": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full">
      
      {/* Header Section */}
      <div className="bg-[#1A1A1A] p-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight text-nowrap">Incoming Requests</h2>
          <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1 italic">Queue Management</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <svg className="text-rose-500" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" transform="rotate(45 12 12)"/>
          </svg>
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
        {requests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
               <svg className="text-gray-300" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" />
               </svg>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-nowrap">Clear: No pending requests</p>
          </div>
        ) : (
          requests.map((r) => (
            <div
              key={r._id}
              className="group relative bg-white border border-gray-100 p-5 rounded-2xl transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-x-1 overflow-hidden"
            >
              {/* Left Indicator Stripe */}
              <div className={`absolute left-0 top-0 w-1 h-full ${r.status === 'APPROVED' ? 'bg-emerald-500' : r.status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500'}`} />

              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <p className="font-black text-slate-800 text-sm tracking-tight group-hover:text-rose-600 transition-colors">
                    {r.title}
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    Request ID: {r._id.slice(-6).toUpperCase()}
                  </p>
                </div>

                <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-colors ${getStatusStyle(r.status)}`}>
                  {r.status}
                </div>
              </div>

              {/* Action Hint (Optional Visual Decor) */}
              <div className="mt-4 flex items-center justify-end">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">View Details</span>
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Branding */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
         <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Operational Request Queue</p>
      </div>
    </div>
  );
}