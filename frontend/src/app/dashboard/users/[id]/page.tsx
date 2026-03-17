"use client";

import { useParams } from "next/navigation";
import { useEffect,useState } from "react";
import { api } from "@/lib/api";

export default function UserDashboard(){

  const params = useParams();
  const userId = params?.id;

  const [stats,setStats] = useState<any>(null);

  useEffect(()=>{
    fetchStats();
  },[]);

  const fetchStats = async ()=>{

    const res = await api.get(
      `/users/${userId}/stats`
    );

    setStats(res.data.data);

  };

  if(!stats) return <div>Loading...</div>;

  return(

    <div className="space-y-6">

      <h1 className="text-xl font-semibold">
        User Performance
      </h1>

      {/* STATS */}

      <div className="grid grid-cols-3 gap-4">

        <div className="border p-4 rounded">
          <p className="text-sm text-gray-500">
            Completed Tasks
          </p>
          <p className="text-xl font-bold">
            {stats.tasksCompleted}
          </p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm text-gray-500">
            In Progress
          </p>
          <p className="text-xl font-bold">
            {stats.tasksInProgress}
          </p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm text-gray-500">
            Pending
          </p>
          <p className="text-xl font-bold">
            {stats.tasksPending}
          </p>
        </div>

      </div>

      {/* ACTIVITY FEED */}

      <div>

        <h2 className="font-semibold mb-3">
          Recent Activity
        </h2>

        {stats.activities.map((a:any)=>(
          <div
            key={a._id}
            className="border p-3 mb-2 rounded"
          >

            <p className="text-sm">
              {a.message}
            </p>

            <p className="text-xs text-gray-500">
              {new Date(a.createdAt).toLocaleString()}
            </p>

          </div>
        ))}

      </div>

    </div>

  );

}