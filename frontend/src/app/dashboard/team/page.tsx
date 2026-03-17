"use client";

import { useEffect,useState } from "react";
import { api } from "@/lib/api";

export default function TeamDashboard(){

  const [data,setData] = useState<any>(null);

  useEffect(()=>{
    fetchData();
  },[]);

  const fetchData = async ()=>{

    const res = await api.get(
      "/analytics/team"
    );

    setData(res.data.data);

  };

  if(!data) return <div>Loading...</div>;

  return(

    <div className="space-y-6">

      <h1 className="text-xl font-semibold">
        Team Dashboard
      </h1>

      {/* CARDS */}

      <div className="grid grid-cols-5 gap-4">

        <Card title="Total Tasks" value={data.totalTasks}/>
        <Card title="Completed" value={data.completedTasks}/>
        <Card title="In Progress" value={data.inProgressTasks}/>
        <Card title="Overdue" value={data.overdueTasks}/>
        <Card title="Burnout Risk" value={data.burnoutUsers}/>

      </div>

      {/* TOP USER */}

      <div className="border p-4 rounded">

        <h2 className="font-semibold mb-2">
          Top Performer
        </h2>

        <p>{data.topUser?.name}</p>

        <p className="text-sm text-gray-500">
          Score: {data.topUser?.performanceScore}
        </p>

        <p className="text-sm">
          {data.topUser?.ratingTag}
        </p>

      </div>

    </div>

  );

}

function Card({title,value}:any){

  return(

    <div className="border p-4 rounded">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-xl font-bold">
        {value}
      </p>

    </div>

  );

}