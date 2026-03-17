"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function ProductivityChart({data}:any){

  return(

    <BarChart
      width={500}
      height={300}
      data={data}
    >

      <CartesianGrid strokeDasharray="3 3"/>

      <XAxis dataKey="name"/>

      <YAxis/>

      <Tooltip/>

      <Bar
        dataKey="tasks"
        fill="#8884d8"
      />

    </BarChart>

  );

}