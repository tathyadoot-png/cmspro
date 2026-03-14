"use client";

import { useEffect,useState } from "react";
import { api } from "@/lib/api";

export default function TaskActivity({taskId}:any){

const [logs,setLogs] = useState<any[]>([]);

useEffect(()=>{
 fetchLogs();
},[]);

const fetchLogs = async ()=>{

 const res = await api.get(`/tasks/${taskId}/activity`);

 setLogs(res.data.data);

};

return(

<div className="bg-card p-4 rounded-lg">

<h2 className="font-semibold mb-3">
Activity
</h2>

<ul className="space-y-2 text-sm">

{logs.map((l)=>(
<li key={l._id}>
{l.user?.name} {l.action}
</li>
))}

</ul>

</div>

);

}