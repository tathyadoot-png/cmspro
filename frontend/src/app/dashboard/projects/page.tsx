"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ProjectsPage(){

const [projects,setProjects] = useState<any[]>([]);
const [title,setTitle] = useState("");

useEffect(()=>{
 fetchProjects();
},[]);

const fetchProjects = async ()=>{

 const res = await api.get("/projects");
 setProjects(res.data.data);

};

const createProject = async ()=>{

 await api.post("/projects",{ title });

 setTitle("");
 fetchProjects();

};

return(

<div className="space-y-6">

<h1 className="text-xl font-semibold">
Projects
</h1>

<div className="flex gap-2">

<input
className="border p-2 rounded"
placeholder="Project title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<button
className="bg-primary text-white px-4 py-2 rounded"
onClick={createProject}
>
Create
</button>

</div>

<table className="w-full text-sm border">

<thead>
<tr className="border-b">
<th className="p-2 text-left">Project</th>
</tr>
</thead>

<tbody>

{projects.map((p)=>(
<tr key={p._id} className="border-b">
<td className="p-2">{p.title}</td>
</tr>
))}

</tbody>

</table>

</div>

);

}