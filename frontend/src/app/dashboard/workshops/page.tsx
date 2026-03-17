"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function WorkshopsPage() {

  const [workshops, setWorkshops] = useState<any[]>([]);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    const res = await api.get("/workshops");
    setWorkshops(res.data.data || []);
  };

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Workshops
        </h1>

        <Link
          href="/dashboard/workshops/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Workshop
        </Link>

      </div>

      {workshops.length === 0 && (
        <div className="text-gray-500">
          No workshops yet
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">

        {workshops.map((w) => (

          <Link
            key={w._id}
            href={`/dashboard/workshops/${w._id}`}
            className="border rounded-lg p-4 hover:bg-gray-100"
          >

            <h2 className="font-semibold text-lg">
              {w.workshopName}
            </h2>

         <p className="text-sm text-gray-500">
  {w.workshopCode}
</p>

<p className="text-sm text-gray-500">
  Members: {w.members?.length || 0}
</p>

          </Link>

        ))}

      </div>

    </div>
  );
}