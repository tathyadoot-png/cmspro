"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ActivityPanel({ workshopId }: any) {

  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {

    const res = await api.get(`/activity/workshop/${workshopId}`);

    setActivity(res.data.data || []);
  };

  return (

    <div className="border rounded p-3">

      <h2 className="font-semibold mb-2">
        Activity
      </h2>

      <div className="space-y-1 text-sm">

        {activity.map((a: any) => (

          <div key={a._id}>
            {a.actionType}
          </div>

        ))}

      </div>

    </div>

  );
}