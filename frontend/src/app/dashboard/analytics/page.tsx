"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import WorkloadChart from "@/components/analytics/WorkloadChart";
import BurnoutPanel from "@/components/analytics/BurnoutPanel";
import WeeklyTrendChart from "@/components/analytics/WeeklyTrendChart";
import SLACard from "@/components/analytics/SLACard";
import ActivityFeed from "@/components/analytics/ActivityFeed";

export default function AnalyticsPage() {

  const [workload,setWorkload] = useState([]);
  const [burnout,setBurnout] = useState([]);
  const [weeklyTrend,setWeeklyTrend] = useState([]);
const [sla,setSla] = useState<any>(null);
  const [activities,setActivities] = useState([]);

  useEffect(()=>{

    fetchData();

  },[]);

  const fetchData = async ()=>{

    const workloadRes = await api.get("/dashboard/workload");
    const burnoutRes = await api.get("/dashboard/burnout");
    const trendRes = await api.get("/dashboard/trend/weekly");
    const slaRes = await api.get("/dashboard/sla");
    const activityRes = await api.get("/activity");

    setWorkload(workloadRes.data.data);
    setBurnout(burnoutRes.data.data);
    setWeeklyTrend(trendRes.data.data);
    setSla(slaRes.data.data);
    setActivities(activityRes.data.data);

  };

  return(

    <div className="space-y-6">

      <div className="grid md:grid-cols-2 gap-6">
        <WorkloadChart data={workload} />
        <BurnoutPanel data={burnout} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <WeeklyTrendChart data={weeklyTrend} />
        <SLACard data={sla} />
      </div>

      <ActivityFeed activities={activities} />

    </div>

  );

}