"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";

type Activity = {
  _id: string;
  message: string;
};

export default function ActivityFeed() {

  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = async () => {

    const res = await api.get("/activity");
    setActivities(res.data.data);

  };

  useEffect(() => {

    fetchActivities();

    socket.on("NEW_ACTIVITY", (activity) => {

      setActivities((prev) => [activity, ...prev]);

    });

    return () => {
      socket.off("NEW_ACTIVITY");
    };

  }, []);

  return (
    <div className="bg-card p-4 rounded-xl">

      <h3 className="font-semibold mb-3">
        Recent Activity
      </h3>

      <div className="space-y-2 text-sm">

        {activities.map((a) => (

          <div key={a._id} className="border-b pb-1">
            {a.message}
          </div>

        ))}

      </div>

    </div>
  );
}