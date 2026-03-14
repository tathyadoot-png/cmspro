"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function TaskFiles({taskId}:any){

const [file,setFile] = useState<any>(null);

const uploadFile = async ()=>{

 const form = new FormData();

 form.append("file",file);

 await api.post(`/tasks/${taskId}/files`,form);

};

return(

<div className="bg-card p-4 rounded-lg space-y-3">

<h2 className="font-semibold">
Files
</h2>

<input
type="file"
onChange={(e)=>setFile(e.target.files?.[0])}
/>

<button
className="bg-primary text-white px-3 py-2 rounded"
onClick={uploadFile}
>
Upload
</button>

</div>

);

}