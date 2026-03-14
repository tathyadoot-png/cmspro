"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function PerformanceChart({data}:any){

  const chartData = data.map((d:any)=>({
    name:d.userId?.name,
    score:d.performanceScore
  }));

  return(

    <div className="bg-card p-6 rounded-xl">

      <h2 className="font-semibold mb-4">
        Performance Score
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={chartData}>

          <XAxis dataKey="name"/>

          <YAxis/>

          <Tooltip/>

          <Bar
            dataKey="score"
            fill="#6366f1"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}