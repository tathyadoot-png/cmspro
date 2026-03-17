"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";

export default function ActivityPanel({ workshopId }: any) {

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {

    if (!workshopId) return;

    fetchActivity();

    // join socket room
    socket.emit("join-workshop", workshopId);

    socket.on("NEW_ACTIVITY", (activity) => {
      setActivities((prev) => [activity, ...prev]);
    });

    return () => {
      socket.off("NEW_ACTIVITY");
    };

  }, [workshopId]);

  const fetchActivity = async () => {

    const res = await api.get(`/activity/workshop/${workshopId}`);

    setActivities(res.data.data || []);

  };

  if (activities.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No activity yet
      </div>
    );
  }

  return (

    <div className="space-y-3">

      {activities.map((a: any) => (

        <div key={a._id} className="border rounded p-3">

          <p className="text-sm">
            <span className="font-semibold">
              {a.userId?.name}
            </span>{" "}
            {a.message}
          </p>

          <p className="text-xs text-gray-500">
            {new Date(a.createdAt).toLocaleString()}
          </p>

        </div>

      ))}

    </div>
  );
}