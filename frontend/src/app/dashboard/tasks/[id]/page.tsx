// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { api } from "@/lib/api";

// import TaskTimeline from "@/components/tasks/TaskTimeline";
// import TaskActivity from "@/components/tasks/TaskActivity";
// import TaskComments from "@/components/tasks/TaskComments";
// import TaskFiles from "@/components/tasks/TaskFiles";

// export default function TaskDetailPage() {

//   const params = useParams();
//   const taskId = params?.id;

//   const [task,setTask] = useState<any>(null);

//   useEffect(()=>{
//     if(taskId) fetchTask();
//   },[taskId]);

//   const fetchTask = async () => {

//     try{

//       const res = await api.get(`/tasks/${taskId}`);

//       setTask(res.data.data);

//     }catch(err){

//       console.error(err);

//     }

//   };

//   if(!task) return <div>Loading...</div>;

//   return (

//     <div className="space-y-6">

//       <div className="space-y-2">

//         <h1 className="text-xl font-semibold">
//           {task.title}
//         </h1>

//         <p className="text-sm text-gray-500">
//           {task.description}
//         </p>

//       </div>

//       <div className="grid md:grid-cols-2 gap-6">

//         <TaskTimeline task={task} />

//         <TaskActivity taskId={task._id} />

//       </div>

//       <TaskComments taskId={task._id} />

//       <TaskFiles taskId={task._id} />

//     </div>

//   );

// }



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

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (taskId) fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tasks/${taskId}`);
      setTask(res.data.data);
    } catch (err) {
      console.error("Failed to fetch task:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Task Intelligence...</p>
    </div>
  );

  if (!task) return (
    <div className="p-8 text-center bg-rose-50 rounded-[2rem] border border-rose-100">
      <p className="text-rose-600 font-bold uppercase text-xs tracking-widest">Task Not Found or Unauthorized</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-10">
      
      {/* 1. Header Section - Task Identity */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
        {/* Decorative Badge */}
        <div className="absolute top-0 right-0 p-6">
          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
            task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
            {task.status || 'Active Operation'}
          </span>
        </div>

        <div className="space-y-4 max-w-3xl">
          <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em]">Project Task Instance</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
            {task.title}
          </h1>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            {task.description}
          </p>
          
          <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-50">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Priority</p>
              <p className="text-xs font-black text-slate-800 uppercase italic tracking-tighter">{task.priority || 'Standard'}</p>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Deadline</p>
              <p className="text-xs font-black text-slate-800 tracking-tighter">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Limit'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-6 bg-rose-600 rounded-full" />
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Operational Timeline</h2>
          </div>
          <TaskTimeline task={task} />
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Real-time Activity</h2>
          </div>
          <TaskActivity taskId={task._id} />
        </div>
      </div>

      {/* 3. Communication & Assets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Intelligence Briefing (Comments)</h2>
            </div>
            <TaskComments taskId={task._id} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Asset Repository</h2>
            </div>
            <TaskFiles taskId={task._id} />
          </div>
        </div>
      </div>

    </div>
  );
}