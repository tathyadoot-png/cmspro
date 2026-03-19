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
    estimatedHours: 0.5,   // 🔥 HOURS (default 30 min)
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

    // 🔥 HOURS → MINUTES conversion
    const estimatedMinutes = Math.round(form.estimatedHours * 60);

    await api.post("/tasks", {
      ...form,
      estimatedMinutes,
      workshopId: workshop._id,
      clientId: workshop.clientId._id,
      taskImages: images
    });

    alert("Task created");
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#1A1A1A] p-8 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Deploy Task</h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">
            Assignment Console
          </p>
        </div>
      </div>

      <form onSubmit={createTask} className="p-8 space-y-6">
        
        {/* Title */}
        <input
          placeholder="Task Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-gray-50 p-4 rounded-xl"
        />

        {/* Description */}
        <textarea
          placeholder="Task Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full bg-gray-50 p-4 rounded-xl"
        />

        {/* Assign + Priority */}
        <div className="grid grid-cols-2 gap-4">

          <select
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            className="bg-gray-50 p-4 rounded-xl"
          >
            <option value="">Select User</option>
            {workshop?.members?.map((m: any) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>

          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="bg-gray-50 p-4 rounded-xl"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

        </div>

        {/* 🔥 TIME INPUT (UPDATED) */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-xs text-gray-400">Time (Hours)</label>

            <input
              type="number"
              step="0.1"
              min="0.1"
              value={form.estimatedHours}
              onChange={(e) =>
                setForm({
                  ...form,
                  estimatedHours: Number(e.target.value)
                })
              }
              className="w-full bg-gray-50 p-4 rounded-xl"
            />

            <p className="text-[10px] text-gray-400 mt-1">
              ≈ {Math.round(form.estimatedHours * 60)} minutes
            </p>
          </div>

          <input
            placeholder="Reference Link"
            value={form.referenceLink}
            onChange={(e) =>
              setForm({ ...form, referenceLink: e.target.value })
            }
            className="bg-gray-50 p-4 rounded-xl"
          />

        </div>

        {/* Upload */}
        <input type="file" multiple onChange={handleFileChange} />

        {uploading && <p>Uploading...</p>}

        {/* Images */}
        <div className="flex gap-2">
          {images.map((img, i) => (
            <img key={i} src={img} className="w-16 h-16 rounded" />
          ))}
        </div>

        <button className="w-full bg-black text-white py-4 rounded-xl">
          Create Task
        </button>

      </form>
    </div>
  );
}