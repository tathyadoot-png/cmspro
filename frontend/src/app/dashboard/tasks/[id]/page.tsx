"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

import TaskTimeline from "@/components/tasks/TaskTimeline";
import TaskActivity from "@/components/tasks/TaskActivity";
import TaskComments from "@/components/tasks/TaskComments";
import TaskFiles from "@/components/tasks/TaskFiles";

export default function TaskDetailPage() {

  const params = useParams();
  const taskId = params?.id;

  const [task,setTask] = useState<any>(null);

  useEffect(()=>{
    if(taskId) fetchTask();
  },[taskId]);

  const fetchTask = async () => {

    try{

      const res = await api.get(`/tasks/${taskId}`);

      setTask(res.data.data);

    }catch(err){

      console.error(err);

    }

  };

  if(!task) return <div>Loading...</div>;

  return (

    <div className="space-y-6">

      <div className="space-y-2">

        <h1 className="text-xl font-semibold">
          {task.title}
        </h1>

        <p className="text-sm text-gray-500">
          {task.description}
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <TaskTimeline task={task} />

        <TaskActivity taskId={task._id} />

      </div>

      <TaskComments taskId={task._id} />

      <TaskFiles taskId={task._id} />

    </div>

  );

}