"use client";

import { useEffect,useState } from "react";
import { api } from "@/lib/api";

export default function MembersPanel({workshopId}:any){

const [members,setMembers] = useState([]);
const [users,setUsers] = useState([]);
const [selected,setSelected] = useState("");

useEffect(()=>{
fetchWorkshop();
fetchUsers();
},[]);

const fetchWorkshop = async()=>{
const res = await api.get(`/workshops/${workshopId}`);
setMembers(res.data.data.members);
};

const fetchUsers = async()=>{
const res = await api.get("/users");
setUsers(res.data.data);
};

const addMember = async()=>{

await api.post(`/workshops/${workshopId}/members`,{
members:[selected]
});

fetchWorkshop();

};

return(

<div className="p-4">

<h2 className="font-semibold mb-3">
Members
</h2>

{members.map((m:any)=>(
<div key={m._id}>{m.name}</div>
))}

<select
className="border mt-3 w-full"
onChange={(e)=>setSelected(e.target.value)}
>

<option>Select user</option>

{users.map((u:any)=>(
<option key={u._id} value={u._id}>
{u.name}
</option>
))}

</select>

<button
onClick={addMember}
className="mt-2 bg-blue-600 text-white px-3 py-1"
>

Add Member

</button>

</div>

);

}