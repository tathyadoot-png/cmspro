"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function RequestPanel({ workshopId }: any) {

  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {

    const res = await api.get(
      `/requests/workshop/${workshopId}`
    );

    setRequests(res.data.data);

  };

  return (

    <div className="space-y-3">

      {requests.map((r) => (

        <div
          key={r._id}
          className="border p-4 rounded-lg"
        >

          <p className="font-semibold">
            {r.title}
          </p>

          <p className="text-sm text-gray-500">
            Status: {r.status}
          </p>

        </div>

      ))}

    </div>

  );

}