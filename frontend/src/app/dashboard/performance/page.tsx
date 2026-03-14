"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import PerformanceLeaderboard from "@/components/performance/PerformanceLeaderboard";
import PerformanceChart from "@/components/performance/PerformanceChart";
import BurnoutOverview from "@/components/performance/BurnoutOverview";

export default function PerformancePage(){

  const [data,setData] = useState([]);

  useEffect(()=>{
    fetchData();
  },[]);

  const fetchData = async ()=>{

    const res = await api.get("/performance/leaderboard");

    setData(res.data.data);

  };

  return(

    <div className="space-y-6">

      <div className="grid md:grid-cols-2 gap-6">

        <PerformanceLeaderboard data={data}/>

        <BurnoutOverview data={data}/>

      </div>

      <PerformanceChart data={data}/>

    </div>

  );

}