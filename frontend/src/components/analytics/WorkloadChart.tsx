"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function WorkloadChart({data}:any){

  return(

    <div className="bg-card p-6 rounded-xl">

      <h2 className="font-semibold mb-4">
        Team Workload
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <Tooltip/>
          <Bar dataKey="tasks" fill="#6366f1"/>
        </BarChart>
      </ResponsiveContainer>

    </div>

  );

}