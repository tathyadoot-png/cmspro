"use client";

import React from "react";

type StatsProps = {
  totalTasks: number;
  safeTasks: number;
  atRiskTasks: number;
  overdueTasks: number;
};

const StatItem = ({ 
  label, 
  value, 
  percentage, 
  color, 
  glowColor, 
  icon 
}: { 
  label: string; 
  value: number; 
  percentage: number; 
  color: string; 
  glowColor: string; 
  icon: React.ReactNode 
}) => {
  // SVG Arc calculation for the progress ring
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex-1 px-8 py-6 relative group border-l border-white/5 first:border-none">
      
      {/* Background Radial Glow */}
      <div className={`absolute inset-0 ${glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none`} />

      <div className="relative z-10 flex items-center justify-between gap-6">
        
        {/* Value and Label */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mb-2">
            {label}
          </h3>
          <p className="text-5xl font-extrabold text-white tracking-tighter leading-none mb-1">
            {value}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
             <span className="text-[11px] font-semibold text-gray-300">of total workload</span>
             <span className={`text-[11px] font-bold ${color}`}>({percentage}%)</span>
          </div>
        </div>

        {/* Progres Arc + Icon */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
            {/* Background Circle */}
            <circle 
              className="text-gray-800" 
              strokeWidth="5" 
              stroke="currentColor" 
              fill="transparent" 
              r={radius} 
              cx="40" 
              cy="40" 
            />
            {/* Progress Arc */}
            <circle 
              className={`${color} transition-all duration-1000 ease-out`} 
              strokeWidth="5" 
              strokeDasharray={circumference} 
              strokeDashoffset={circumference} /* Starts empty */
              style={{ strokeDashoffset: offset }} /* Animates to offset */
              strokeLinecap="round" 
              stroke="currentColor" 
              fill="transparent" 
              r={radius} 
              cx="40" 
              cy="40" 
            />
          </svg>
          <div className={`absolute text-gray-600 group-hover:${color} transition-colors duration-300`}>
             {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TLStatsCards({
  totalTasks,
  safeTasks,
  atRiskTasks,
  overdueTasks,
}: StatsProps) {
  // Simple calculation for percentages (handle division by zero if totalTasks is 0)
  const safePercent = totalTasks > 0 ? Math.round((safeTasks / totalTasks) * 100) : 0;
  const atRiskPercent = totalTasks > 0 ? Math.round((atRiskTasks / totalTasks) * 100) : 0;
  const overduePercent = totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-10 bg-[#FDFDFD] min-h-[300px] font-sans">
      <div className="bg-[#030712] rounded-[2rem] border border-white/5 flex flex-col md:flex-row shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
        
        <StatItem 
          label="Total Workflow" 
          value={totalTasks} 
          percentage={100} 
          color="text-white" 
          glowColor="bg-primary/10" 
          icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>}
        />
        <StatItem 
          label="Safe Projects" 
          value={safeTasks} 
          percentage={safePercent} 
          color="text-emerald-500" 
          glowColor="bg-emerald-500/10" 
          icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
        />
        <StatItem 
          label="Risk Detected" 
          value={atRiskTasks} 
          percentage={atRiskPercent} 
          color="text-amber-500" 
          glowColor="bg-amber-500/10" 
          icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>}
        />
        <StatItem 
          label="Breached Deadlines" 
          value={overdueTasks} 
          percentage={overduePercent} 
          color="text-rose-500" 
          glowColor="bg-rose-500/10" 
          icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
        />

      </div>
    </div>
  );
}