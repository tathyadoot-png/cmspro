"use client";

export default function TaskTimeline({task}:any){

return(

<div className="bg-card p-4 rounded-lg">

<h2 className="font-semibold mb-3">
Timeline
</h2>

<ul className="space-y-2 text-sm">

<li>Created: {new Date(task.createdAt).toLocaleString()}</li>

{task.startedAt && (
<li>Started: {new Date(task.startedAt).toLocaleString()}</li>
)}

{task.submittedAt && (
<li>Submitted: {new Date(task.submittedAt).toLocaleString()}</li>
)}

{task.completedAt && (
<li>Completed: {new Date(task.completedAt).toLocaleString()}</li>
)}

</ul>

</div>

);

}