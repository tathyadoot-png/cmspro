"use client";

import { useEffect,useState } from "react";
import { api } from "@/lib/api";
import ProductivityChart from "@/components/ProductivityChart";

export default function AnalyticsPage(){

  const [users,setUsers] = useState<any[]>([]);

  useEffect(()=>{
    fetchLeaderboard();
  },[]);

  const fetchLeaderboard = async ()=>{

    const res = await api.get(
      "/analytics/leaderboard"
    );

    setUsers(res.data.data);

  };

  // 👇 GRAPH DATA
  const chartData = users.map((u:any)=>({
    name: u.name,
    tasks: u.completedTasks
  }));

  return(

    <div className="space-y-6">

      <h1 className="text-xl font-semibold">
        Performance Leaderboard
      </h1>

      {/* LEADERBOARD TABLE */}

      <table className="w-full border text-sm">

        <thead>
          <tr className="border-b">
            <th className="p-2">Rank</th>
            <th className="p-2">User</th>
            <th className="p-2">Score</th>
            <th className="p-2">Rating</th>
          </tr>
        </thead>

        <tbody>

          {users.map((u,i)=>(
            <tr key={u._id} className="border-b">

              <td className="p-2">
                #{i+1}
              </td>

              <td className="p-2">
                {u.name}
              </td>

              <td className="p-2">
                {u.performanceScore}
              </td>

              <td className="p-2">
                {u.ratingTag}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {/* 👇 PRODUCTIVITY GRAPH */}

      <div>

        <h2 className="font-semibold">
          Productivity Graph
        </h2>

        <ProductivityChart data={chartData}/>

      </div>

    </div>

  );

}