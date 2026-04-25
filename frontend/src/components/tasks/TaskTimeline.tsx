"use client";

export default function TaskTimeline({ task }: any) {
  const points = [
    { label: "Created", date: task.createdAt, active: true },
    { label: "Started", date: task.startedAt, active: !!task.startedAt },
    { label: "Submitted", date: task.submittedAt, active: !!task.submittedAt },
    { label: "Completed", date: task.completedAt, active: !!task.completedAt },
  ].filter(p => p.date);

  return (
    <div className="relative pl-6 space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
      {points.map((point, i) => (
        <div key={i} className="relative group">
          <div className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-md transition-all ${
            point.active ? 'bg-rose-500 scale-110' : 'bg-slate-200'
          }`} />
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{point.label}</p>
          <p className="text-xs font-bold text-slate-700">{new Date(point.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}