"use client";

import { useEffect,useState } from "react";
import { api } from "@/lib/api";

export default function TaskComments({taskId}:any){

const [comments,setComments] = useState<any[]>([]);
const [text,setText] = useState("");

useEffect(()=>{
 fetchComments();
},[]);

const fetchComments = async ()=>{

 const res = await api.get(`/tasks/${taskId}/comments`);

 setComments(res.data.data);

};

const addComment = async ()=>{

 await api.post(`/tasks/${taskId}/comments`,{
  text
 });

 setText("");
 fetchComments();

};

return(

<div className="bg-card p-4 rounded-lg space-y-3">

<h2 className="font-semibold">
Comments
</h2>

<div className="space-y-2">

{comments.map((c)=>(
<div key={c._id} className="border p-2 rounded text-sm">
<b>{c.user?.name}</b>: {c.text}
</div>
))}

</div>

<div className="flex gap-2">

<input
className="border p-2 rounded flex-1"
placeholder="Write comment"
value={text}
onChange={(e)=>setText(e.target.value)}
/>

<button
className="bg-primary text-white px-3 py-2 rounded"
onClick={addComment}
>
Send
</button>

</div>

</div>

);

}