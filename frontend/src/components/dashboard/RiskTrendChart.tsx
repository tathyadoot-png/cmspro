"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  
} from "recharts";
import { AlertTriangle } from "lucide-react";

type DataType = {
  day: string;
  risk: number;
};

type Props = {
  data: DataType[];
};

const CustomActiveDot = (props: any) => {
  const { cx, cy } = props;

  return (
    <foreignObject x={cx - 12} y={cy - 12} width={24} height={24}>
      <div className="flex items-center justify-center">
        <AlertTriangle size={20} className="text-red-500 drop-shadow-md" />
      </div>
    </foreignObject>
  );
};


export default function RiskTrendChart({ data }: Props) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-[400px] flex flex-col">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Risk Analysis</h2>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Weekly Performance Trend</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-lg border border-rose-100">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-rose-600 uppercase">High Risk Detected</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            {/* Minimalist Grid - only horizontal */}
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              dy={15}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
            />

            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: 'none', 
                borderRadius: '12px', 
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
              }}
              itemStyle={{ color: '#ef4444' }}
              cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
            />

            {/* Gradient Fill Area */}
            <Area
              type="monotone"
              dataKey="risk"
              stroke="none"
              fillOpacity={1}
              fill="url(#colorRisk)"
            />

            {/* The Main Glowing Line */}
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#ef4444"
              strokeWidth={4}
              dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
              activeDot={<CustomActiveDot />}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend */}
      <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
         <div className="flex gap-4">
            <div className="flex items-center gap-2">
               <div className="w-3 h-[3px] bg-rose-500 rounded-full"></div>
               <span className="text-[11px] font-bold text-gray-500 uppercase">Critical Risk</span>
            </div>
         </div>
         <button className="text-[11px] font-bold text-gray-400 hover:text-rose-500 transition-colors uppercase tracking-widest">
            View Full Report →
         </button>
      </div>
    </div>
  );
}