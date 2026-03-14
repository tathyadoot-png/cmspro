"use client";

import { useEffect,useState } from "react";
import { api } from "@/lib/api";

export default function TaskPanel({workshopId}:any){

const [tasks,setTasks] = useState<any[]>([]);

useEffect(()=>{
fetchTasks();
},[]);

const fetchTasks = async () =>{

const res = await api.get(`/tasks?workshopId=${workshopId}`);

setTasks(res.data.data || []);

};

return(

<div className="p-4">

<h2 className="font-semibold mb-3">
Tasks
</h2>

{tasks.map((t)=>(
<div key={t._id} className="border p-2 mb-2 text-sm">
{t.title}
</div>
))}

</div>

);

}