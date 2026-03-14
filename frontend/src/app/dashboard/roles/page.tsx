"use client";

import { useEffect,useState } from "react";
import { api } from "@/lib/api";

export default function RolesPage(){

const [roles,setRoles] = useState<any[]>([]);
const [name,setName] = useState("");
const [editingId,setEditingId] = useState<string|null>(null);

useEffect(()=>{
 fetchRoles();
},[]);

const fetchRoles = async ()=>{

 const res = await api.get("/roles");
 setRoles(res.data.data);

};

const handleCreate = async ()=>{

 await api.post("/roles",{name});

 setName("");
 fetchRoles();

};

const handleEdit = (role:any)=>{

 setName(role.name);
 setEditingId(role._id);

};

const handleUpdate = async ()=>{

 await api.put(`/roles/${editingId}`,{
  name
 });

 setEditingId(null);
 setName("");

 fetchRoles();

};

const handleDelete = async(id:string)=>{

 await api.delete(`/roles/${id}`);

 fetchRoles();

};

return(

<div className="space-y-6">

<h1 className="text-xl font-semibold">
Roles
</h1>

<div className="flex gap-2">

<input
className="border p-2"
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Role name"
/>

{editingId ? (

<button
className="bg-green-600 text-white px-4 py-2 rounded"
onClick={handleUpdate}
>
Update
</button>

) : (

<button
className="bg-primary text-white px-4 py-2 rounded"
onClick={handleCreate}
>
Add Role
</button>

)}

</div>

<ul className="space-y-2">

{roles.map((r)=>(

<li
key={r._id}
className="border p-2 rounded flex justify-between"
>

{r.name}

<div className="flex gap-3">

<button
className="text-blue-600"
onClick={()=>handleEdit(r)}
>
Edit
</button>

<button
className="text-red-600"
onClick={()=>handleDelete(r._id)}
>
Delete
</button>

</div>

</li>

))}

</ul>

</div>

);

}