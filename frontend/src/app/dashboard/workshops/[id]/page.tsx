"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import PerformancePanel from "./components/PerformancePanel";
import WorkshopHeader from "./components/WorkshopHeader";
import WorkshopStats from "./components/WorkshopStats";
import MembersPanel from "./components/MembersPanel";
import ActivityPanel from "./components/ActivityPanel";
import TLPanel from "./components/TLPanel";
import CreateTaskPanel from "./components/CreateTaskPanel";
import TaskPanel from "./components/TaskPanel";
export default function WorkshopPage() {

  const params = useParams();
  const workshopId = params?.id;

  const [workshop, setWorkshop] = useState<any>(null);
  const [tab, setTab] = useState("members");

  useEffect(() => {
    fetchWorkshop();
  }, []);

  const fetchWorkshop = async () => {

    const res = await api.get(`/workshops/${workshopId}`);

    setWorkshop(res.data.data);

  };

  if (!workshop) return <div>Loading...</div>;

  return (

    <div className="p-6 space-y-6">

      <WorkshopHeader workshop={workshop} />

      <WorkshopStats workshopId={workshopId} />

      {/* Tabs */}

      <div className="flex gap-4 border-b pb-2">

        <button onClick={()=>setTab("members")}>Members</button>
        <button onClick={()=>setTab("tasks")}>Tasks</button>
        <button onClick={()=>setTab("activity")}>Activity</button>
<button onClick={()=>setTab("performance")}>
  Performance
</button>

<button onClick={()=>setTab("createTask")}>
Create Task
</button>
      </div>

      {tab === "members" && (
<MembersPanel workshopId={workshopId} workshop={workshop} />
      )}
{tab === "performance" && (
  <PerformancePanel workshopId={workshopId} />
)}
{tab === "activity" && (
  <ActivityPanel workshopId={workshopId} />
)}
{tab === "teamlead" && (
  <TLPanel workshopId={workshopId} />
)}
{tab === "createTask" && (
<CreateTaskPanel workshop={workshop} />)}
{tab === "tasks" && (
  <TaskPanel workshopId={workshopId} />
)}
    </div>

  );

}