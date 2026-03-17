"use client";

import React from "react";

type Escalation = {
  id: string;
  taskTitle: string;
  riskLevel: "HIGH" | "OVERDUE";
};

type Props = {
  escalations: Escalation[];
};

export default function EscalationPanel({ escalations }: Props) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col h-full">
      
      {/* Panel Header */}
      <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/30">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Escalations</h2>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.15em] mt-1">Critical Attention Required</p>
        </div>
        <div className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-rose-500/20">
          {escalations.length} ACTIVE
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-y-auto max-h-[500px] space-y-4 custom-scrollbar">
        {escalations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
            </div>
            <p className="text-sm font-bold text-slate-900">All Clear</p>
            <p className="text-xs text-gray-400 mt-1">No pending escalations found.</p>
          </div>
        ) : (
          escalations.map((item) => (
            <div
              key={item.id}
              className="group relative flex justify-between items-center bg-white border border-gray-100 p-5 rounded-2xl transition-all duration-300 hover:shadow-md hover:border-rose-100"
            >
              {/* Left Accent Bar on Hover */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-2/3 rounded-r-full transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                item.riskLevel === "OVERDUE" ? "bg-rose-500 shadow-[4px_0_10px_rgba(225,29,72,0.3)]" : "bg-amber-500"
              }`} />

              <div className="flex items-center gap-4 transition-transform duration-300 group-hover:translate-x-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  item.riskLevel === "OVERDUE" ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500"
                }`}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-tight">{item.taskTitle}</p>
                  <p className="text-[11px] text-gray-400 font-medium mt-1">Internal Reference: #{item.id.slice(0,5)}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-lg tracking-widest uppercase transition-all ${
                    item.riskLevel === "OVERDUE"
                      ? "bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white"
                      : "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white"
                  }`}
                >
                  {item.riskLevel}
                </span>
                <span className="text-[9px] text-gray-300 font-bold uppercase group-hover:text-gray-400">Manage →</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Footer */}
      {/* <div className="p-6 bg-gray-50/50 mt-auto border-t border-gray-100">
        <button className="w-full py-3 bg-white border border-gray-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all duration-300 shadow-sm">
          VIEW ALL ESCALATIONS
        </button>
      </div> */}
    </div>
  );
}