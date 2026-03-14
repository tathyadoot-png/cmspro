"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";

import TaskTimeline from "@/components/tasks/TaskTimeline";
import TaskComments from "@/components/tasks/TaskComments";
import TaskFiles from "@/components/tasks/TaskFiles";
import TaskActivity from "@/components/tasks/TaskActivity";

export default function TaskDetailPage(){

const { id } = useParams();

const [task,setTask] = useState<any>(null);

useEffect(()=>{
 fetchTask();
},[]);

const fetchTask = async ()=>{

 const res = await api.get(`/tasks/${id}`);

 setTask(res.data.data);

};

if(!task) return <div>Loading...</div>;

return(

<div className="space-y-6">

<h1 className="text-xl font-semibold">
{task.title}
</h1>

<p className="text-sm text-gray-500">
{task.description}
</p>

<div className="grid md:grid-cols-2 gap-6">

<TaskTimeline task={task} />

<TaskActivity taskId={task._id} />

</div>

<TaskComments taskId={task._id} />

<TaskFiles taskId={task._id} />

</div>

);

}