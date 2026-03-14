"use client";

import { useEffect,useState } from "react";
import { api } from "@/lib/api";

export default function ActivityPanel({workshopId}:any){

const [activity,setActivity] = useState<any[]>([]);

useEffect(()=>{
fetchActivity();
},[]);

const fetchActivity = async ()=>{

const res = await api.get(`/activity?workshopId=${workshopId}`);

setActivity(res.data.data || []);

};

return(

<div className="p-4">

<h2 className="font-semibold mb-3">
Activity
</h2>

{activity.map((a)=>(
<div key={a._id} className="text-sm mb-2">
{a.message}
</div>
))}

</div>

);

}