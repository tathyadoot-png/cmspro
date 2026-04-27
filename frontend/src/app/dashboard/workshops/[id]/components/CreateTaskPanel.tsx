"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function CreateTaskPanel({ workshop }: any) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    estimatedHours: 0.5,
    priority: "MEDIUM",
    referenceLink: "",
    taskType : "",
    
  });

  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages((prev) => [...prev, res.data.url]);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: any) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of files) {
      await uploadImage(file);
    }
  };

  const createTask = async (e: any) => {
    e.preventDefault();
    const estimatedMinutes = Math.round(form.estimatedHours * 60);
    await api.post("/tasks", {
      ...form,
      estimatedMinutes,
      workshopId: workshop._id,
      clientId: workshop.clientId._id,
      taskImages: images
    });
    alert("Task created successfully!");
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_80px_rgba(0,0,0,0.05)] overflow-hidden max-w-4xl mx-auto">
      
      {/* 1. HEADER SECTION */}
      <div className="bg-slate-900 p-6 md:p-8 flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Deploy New Task</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.25em] mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
             Assignment Terminal
          </p>
        </div>
        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <form onSubmit={createTask} className="p-6 md:p-8 space-y-6 bg-[#FDFDFF]">
        
        {/* TASK TITLE */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Task Context</label>
          <input
            placeholder="What needs to be done?"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[14px] font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-1.5">
          <textarea
            rows={4}
            placeholder="Add detailed instructions..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[14px] font-medium text-slate-700 outline-none focus:border-indigo-500 transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="w-full">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Task Type (Optional)
  </label>

  <select
    name="taskType"
    value={form.taskType || ""}
    onChange={handleFileChange}
    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141414] 
    border border-gray-300 dark:border-gray-700 
    text-sm text-gray-800 dark:text-gray-200
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
    transition-all duration-200"
  >
    <option value="">Select Type</option>
    <option value="REEL">Reel</option>
    <option value="GRAPHIC">Graphic</option>
    <option value="BANNER">Banner</option>
    <option value="MEDIA_COVERAGE">Media Coverage</option>
    <option value="OTHERS">Others</option>
  </select>
</div>

        {/* ASSIGN + PRIORITY (Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Assignee</label>
            <select
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[14px] font-bold text-slate-700 appearance-none outline-none focus:border-indigo-500 transition-all"
            >
              <option value="">Select User</option>
              {workshop?.members?.map((m: any) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Urgency</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className={`w-full border border-slate-200 p-4 rounded-2xl text-[14px] font-black appearance-none outline-none focus:border-indigo-500 transition-all
                ${form.priority === 'URGENT' ? 'text-rose-600 bg-rose-50/50' : 'text-slate-700 bg-white'}
              `}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>
        </div>

        {/* TIME + REFERENCE (Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Estimated Hours</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={form.estimatedHours}
                onChange={(e) => setForm({ ...form, estimatedHours: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[14px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">
                {Math.round(form.estimatedHours * 60)} MINS
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset Link</label>
            <input
              placeholder="e.g. Figma or Drive link"
              value={form.referenceLink}
              onChange={(e) => setForm({ ...form, referenceLink: e.target.value })}
              className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[14px] font-medium text-slate-700 outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* FILE UPLOAD ZONE */}
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Supporting Media</label>
          <div className="flex flex-wrap gap-3">
            <label className="cursor-pointer group">
              <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-300 group-hover:text-indigo-500">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <input type="file" multiple onChange={handleFileChange} className="hidden" />
            </label>

            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-2xl border border-slate-100 shadow-sm" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl transition-all flex items-center justify-center">
                   <span className="text-[8px] text-white font-bold uppercase tracking-tighter cursor-pointer">Remove</span>
                </div>
              </div>
            ))}

            {uploading && (
              <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-slate-100 rounded-2xl flex items-center justify-center animate-pulse bg-slate-50">
                <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce" />
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-[13px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all hover:shadow-xl hover:shadow-indigo-200 active:scale-[0.98] mt-4 shadow-lg shadow-slate-200">
          Create Task & Notify Team
        </button>

      </form>
    </div>
  );
}