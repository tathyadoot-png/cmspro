"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

import TaskPanel from "./components/TaskPanel";
import ChatPanel from "./components/ChatPanel";
import MembersPanel from "./components/MembersPanel";
import ActivityPanel from "./components/ActivityPanel";

export default function WorkshopPage() {

  const params = useParams();
  const workshopId = params.id as string;

  const [workshop, setWorkshop] = useState<any>(null);

  useEffect(() => {
    fetchWorkshop();
  }, []);

  const fetchWorkshop = async () => {

    const res = await api.get(`/workshops/${workshopId}`);

    setWorkshop(res.data.data);

  };

  if (!workshop)
    return <div className="p-6">Loading...</div>;

  return (

    <div className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">
        {workshop.workshopName}
      </h1>

      <MembersPanel workshopId={workshopId} />

      <div className="grid grid-cols-3 gap-4">

        <div className="col-span-2">
          <TaskPanel workshopId={workshopId} />
        </div>

        <div className="space-y-4">
          <ChatPanel workshopId={workshopId} />
          <ActivityPanel workshopId={workshopId} />
        </div>

      </div>

    </div>

  );
}