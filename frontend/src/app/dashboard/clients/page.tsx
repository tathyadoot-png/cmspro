"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ClientsPage(){

const [clients,setClients] = useState<any[]>([]);
const [name,setName] = useState("");
const [clientType,setClientType] = useState("CORPORATE");
const [editingId,setEditingId] = useState<string | null>(null);

useEffect(()=>{
 fetchClients();
},[]);

const fetchClients = async ()=>{
 const res = await api.get("/clients");
 setClients(res.data.data);
};

const handleCreate = async ()=>{

 if(!name) return;

 await api.post("/clients",{
  name,
  clientType
 });

 setName("");
 fetchClients();
};

const handleDelete = async(id:string)=>{

 await api.delete(`/clients/${id}`);
 fetchClients();

};

const handleEdit = (client:any)=>{

 setName(client.name);
 setClientType(client.clientType);
 setEditingId(client._id);

};

const handleUpdate = async ()=>{

 if(!editingId) return;

 await api.put(`/clients/${editingId}`,{
  name,
  clientType
 });

 setEditingId(null);
 setName("");
 fetchClients();

};

return(

<div className="space-y-6">

<h1 className="text-xl font-semibold">
Clients
</h1>

<div className="flex gap-2">

<input
className="border p-2 rounded w-60"
placeholder="Client name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<select
className="border p-2 rounded"
value={clientType}
onChange={(e)=>setClientType(e.target.value)}
>
<option value="CORPORATE">Corporate</option>
<option value="POLITICAL">Political</option>
</select>

{editingId ? (

<button
className="bg-green-600 text-white px-4 py-2 rounded"
onClick={handleUpdate}
>
Update
</button>

) : (

<button
className="bg-primary text-red-600 px-4 py-2 rounded"
onClick={handleCreate}
>
Add Client
</button>

)}

</div>

<table className="w-full text-sm border">

<thead>

<tr className="border-b bg-gray-100">
<th className="p-2 text-left">Client Name</th>
<th className="p-2 text-left">Type</th>
<th className="p-2 text-left">Actions</th>
</tr>

</thead>

<tbody>

{clients.map((c)=>(
<tr key={c._id} className="border-b">

<td className="p-2">
{c.name}
</td>

<td className="p-2">
<span className="px-2 py-1 text-xs rounded bg-gray-200">
{c.clientType}
</span>
</td>

<td className="p-2 flex gap-3">

<button
className="text-blue-600"
onClick={()=>handleEdit(c)}
>
Edit
</button>

<button
className="text-red-600"
onClick={()=>handleDelete(c._id)}
>
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

);

}