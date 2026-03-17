"use client";

import React from "react";

type Props = {
  status: string;
  risk: string;
  onStatusChange: (value: string) => void;
  onRiskChange: (value: string) => void;
};

export default function TaskFilters({
  status,
  risk,
  onStatusChange,
  onRiskChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      
      {/* Status Filter */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors pointer-events-none">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M3 6h18M3 12h18m-7 6h7" strokeLinecap="round"/>
          </svg>
        </div>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="appearance-none bg-gray-50 border border-gray-100 text-slate-700 text-[11px] font-bold uppercase tracking-widest rounded-xl pl-10 pr-10 py-3 cursor-pointer focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/5 transition-all outline-none shadow-sm"
        >
          <option value="">All Status</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="IN_REVIEW">IN_REVIEW</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
        </div>
      </div>

      {/* Risk Filter */}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors pointer-events-none">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <select
          value={risk}
          onChange={(e) => onRiskChange(e.target.value)}
          className="appearance-none bg-gray-50 border border-gray-100 text-slate-700 text-[11px] font-bold uppercase tracking-widest rounded-xl pl-10 pr-10 py-3 cursor-pointer focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/5 transition-all outline-none shadow-sm"
        >
          <option value="">All Risk</option>
          <option value="SAFE">SAFE</option>
          <option value="AT_RISK">AT_RISK</option>
          <option value="OVERDUE">OVERDUE</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
        </div>
      </div>

      {/* Active Count Badge - Extra Touch */}
      {(status || risk) && (
        <button 
          onClick={() => { onStatusChange(""); onRiskChange(""); }}
          className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-tighter ml-2"
        >
          Clear Filters
        </button>
      )}

    </div>
  );
}