// "use client";

// import { useState } from "react";
// import { api } from "@/lib/api";

// export default function CreateTaskPanel({ workshop }: any) {

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     assignedTo: "",
//     estimatedMinutes: 30,
//     priority: "MEDIUM",
//     referenceLink: ""
//   });

//   const [images, setImages] = useState<any[]>([]);
//   const [uploading, setUploading] = useState(false);

//   /* =========================
//      UPLOAD IMAGE
//   ========================= */
// const uploadImage = async (file: File) => {
//   try {
//     setUploading(true);

//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await api.post("/upload", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     setImages((prev) => [...prev, res.data.url]);
//   } catch (err) {
//     console.error(err);
//     alert("Upload failed");
//   } finally {
//     setUploading(false);
//   }
// };
//   /* =========================
//      HANDLE FILE CHANGE
//   ========================= */
// const handleFileChange = async (e: any) => {
//   const files = e.target.files;
//   if (!files) return;

//   for (const file of files) {
//     await uploadImage(file);
//   }
// };

//   /* =========================
//      CREATE TASK
//   ========================= */
//   const createTask = async (e: any) => {

//     e.preventDefault();

//     await api.post("/tasks", {
//       ...form,
//       workshopId: workshop._id,
//       clientId: workshop.clientId._id,
//       taskImages: images
//     });

//     alert("Task created");
//   };

//   return (

//     <div className="border p-4 rounded space-y-4">

//       <h2 className="font-semibold text-lg">
//         Create Task
//       </h2>

//       <form onSubmit={createTask} className="space-y-3">

//         {/* TITLE */}
//         <input
//           className="border p-2 w-full"
//           placeholder="Task title"
//           value={form.title}
//           onChange={(e) =>
//             setForm({ ...form, title: e.target.value })
//           }
//         />

//         {/* DESCRIPTION */}
//         <textarea
//           className="border p-2 w-full"
//           placeholder="Description"
//           value={form.description}
//           onChange={(e) =>
//             setForm({ ...form, description: e.target.value })
//           }
//         />

//         {/* ASSIGN */}
//         <select
//           className="border p-2 w-full"
//           value={form.assignedTo}
//           onChange={(e) =>
//             setForm({ ...form, assignedTo: e.target.value })
//           }
//         >
//           <option value="">Assign Member</option>
//           {workshop?.members?.map((m: any) => (
//             <option key={m._id} value={m._id}>
//               {m.name}
//             </option>
//           ))}
//         </select>

//         {/* TIME */}
//         <input
//           type="number"
//           className="border p-2 w-full"
//           placeholder="Estimated Minutes"
//           value={form.estimatedMinutes}
//           onChange={(e) =>
//             setForm({
//               ...form,
//               estimatedMinutes: Number(e.target.value)
//             })
//           }
//         />

//         {/* PRIORITY */}
//         <select
//           className="border p-2 w-full"
//           value={form.priority}
//           onChange={(e) =>
//             setForm({ ...form, priority: e.target.value })
//           }
//         >
//           <option value="LOW">LOW</option>
//           <option value="MEDIUM">MEDIUM</option>
//           <option value="HIGH">HIGH</option>
//           <option value="URGENT">URGENT</option>
//         </select>

//         {/* LINK */}
//         <input
//           className="border p-2 w-full"
//           placeholder="Video / Reference Link"
//           value={form.referenceLink}
//           onChange={(e) =>
//             setForm({ ...form, referenceLink: e.target.value })
//           }
//         />

//         {/* IMAGE UPLOAD */}
//         <input
//           type="file"
//           multiple
//           onChange={handleFileChange}
//         />

//         {uploading && (
//           <p className="text-sm text-blue-600">
//             Uploading image...
//           </p>
//         )}

//         {/* PREVIEW */}
//         <div className="flex gap-2 flex-wrap">
//           {images.map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               className="w-20 h-20 object-cover rounded"
//             />
//           ))}
//         </div>

//         {/* BUTTON */}
//         <button className="bg-green-600 text-white px-4 py-2 rounded">
//           Create Task
//         </button>

//       </form>

//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function CreateTaskPanel({ workshop }: any) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    estimatedMinutes: 30,
    priority: "MEDIUM",
    referenceLink: ""
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
    await api.post("/tasks", {
      ...form,
      workshopId: workshop._id,
      clientId: workshop.clientId._id,
      taskImages: images
    });
    alert("Task created");
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
      
      {/* Dark Header */}
      <div className="bg-[#1A1A1A] p-8 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Deploy Task</h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Assignment Console</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <svg className="text-rose-500" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <form onSubmit={createTask} className="p-8 space-y-6">
        
        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Objective</label>
          <input
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-rose-500 focus:bg-white transition-all placeholder:text-gray-300"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Context & Details</label>
          <textarea
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-rose-500 focus:bg-white transition-all placeholder:text-gray-300 min-h-[100px] resize-none"
            placeholder="Describe the workflow requirements..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignee</label>
            <select
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-rose-500 cursor-pointer appearance-none"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            >
              <option value="">Select Member</option>
              {workshop?.members?.map((m: any) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
            <select
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-rose-500 cursor-pointer appearance-none"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>
        </div>

        {/* Time & Links */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Est. Minutes</label>
            <input
              type="number"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-rose-500"
              value={form.estimatedMinutes}
              onChange={(e) => setForm({ ...form, estimatedMinutes: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Link</label>
            <input
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-rose-500"
              placeholder="Video or URL"
              value={form.referenceLink}
              onChange={(e) => setForm({ ...form, referenceLink: e.target.value })}
            />
          </div>
        </div>

        {/* Asset Upload */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Assets</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-100 rounded-[2rem] cursor-pointer bg-gray-50 hover:bg-rose-50 hover:border-rose-200 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-2 text-gray-300 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Click to upload reference images</p>
              </div>
              <input type="file" className="hidden" multiple onChange={handleFileChange} />
            </label>
          </div>

          {uploading && (
            <div className="flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Uploading Media...</p>
            </div>
          )}

          {/* Image Previews */}
          <div className="flex gap-3 flex-wrap">
            {images.map((img, i) => (
              <div key={i} className="group relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button className="group relative w-full overflow-hidden bg-[#1A1A1A] text-white py-5 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all hover:shadow-2xl hover:shadow-rose-100">
          <span className="relative z-10 flex items-center justify-center gap-3">
            Initialize Task
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="group-hover:translate-x-1 transition-transform">
              <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round"/>
            </svg>
          </span>
          <div className="absolute inset-0 bg-rose-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>

      </form>
    </div>
  );
}