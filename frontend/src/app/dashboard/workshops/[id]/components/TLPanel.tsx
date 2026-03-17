"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TLPanel({ workshopId }: any) {

  const [teamLeads,setTeamLeads] = useState<any[]>([]);
  const [users,setUsers] = useState<any[]>([]);
  const [selected,setSelected] = useState("");

  useEffect(()=>{
    fetchTL();
    fetchUsers();
  },[workshopId]);

  const fetchTL = async()=>{

    const res = await api.get(`/workshops/${workshopId}`);

    setTeamLeads(res.data.data.teamLeads || []);

  };

  const fetchUsers = async()=>{

    const res = await api.get("/users");

    setUsers(res.data.data || []);

  };

  const addTL = async()=>{

    if(!selected) return;

    await api.post(`/workshops/${workshopId}/teamleads`,{
      teamLeads:[selected]
    });

    fetchTL();
    setSelected("");

  };

  return(

    <div className="border rounded p-4 space-y-3">

      <h2 className="font-semibold">
        Team Leads
      </h2>

      {teamLeads.map((u:any)=>(
        <div key={u._id}>
          {u.name}
        </div>
      ))}

      <div className="flex gap-2">

        <select
          value={selected}
          onChange={(e)=>setSelected(e.target.value)}
          className="border p-2"
        >

          <option value="">Select user</option>

          {users.map((u:any)=>(
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}

        </select>

        <button
          onClick={addTL}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add TL
        </button>

      </div>

    </div>

  );

}