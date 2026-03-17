// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";
// import { useRouter } from "next/navigation";

// export default function CreateWorkshopPage() {

//   const router = useRouter();

//   const [clients,setClients] = useState<any[]>([]);

//   const [form,setForm] = useState({
//     workshopName:"",
//     description:"",
//     clientId:""
//   });

//   useEffect(()=>{
//     fetchClients();
//   },[]);

//   const fetchClients = async () =>{
//     const res = await api.get("/clients");
//     setClients(res.data.data || []);
//   }

//   const handleSubmit = async(e:any)=>{
//     e.preventDefault();

//     await api.post("/workshops",form);

//     router.push("/dashboard/workshops");
//   }

//   return (
//     <div className="p-6 max-w-xl">

//       <h1 className="text-xl font-bold mb-4">
//         Create Workshop
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-4">

//         <select
//           className="border p-2 w-full"
//           value={form.clientId}
//           onChange={(e)=>
//             setForm({...form,clientId:e.target.value})
//           }
//         >
//           <option value="">Select Client</option>

//           {clients.map((c)=>(
//             <option key={c._id} value={c._id}>
//               {c.name}
//             </option>
//           ))}

//         </select>

//         <input
//           className="border p-2 w-full"
//           placeholder="Workshop Name"
//           value={form.workshopName}
//           onChange={(e)=>
//             setForm({...form,workshopName:e.target.value})
//           }
//         />

//         <textarea
//           className="border p-2 w-full"
//           placeholder="Description"
//           value={form.description}
//           onChange={(e)=>
//             setForm({...form,description:e.target.value})
//           }
//         />

//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Create Workshop
//         </button>

//       </form>

//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateWorkshopPage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState({
    workshopName: "",
    description: "",
    clientId: ""
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await api.post("/workshops", form);
      router.push("/dashboard/workshops");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto min-h-screen">
      
      {/* --- Back Button --- */}
      <button 
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 hover:text-rose-600 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M19 12H5m0 0l7-7m-7 7l7 7" strokeLinecap="round" />
        </svg>
        Back to Fleet
      </button>

      {/* --- Form Container --- */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Dark Header */}
        <div className="bg-[#1A1A1A] p-10 border-b border-white/5">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Initialize <span className="text-rose-600">Workshop</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">
            Configure new operational parameters
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          
          {/* Client Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Select Client Entity
            </label>
            <div className="relative">
              <select
                required
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-rose-500 focus:bg-white transition-all appearance-none cursor-pointer"
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              >
                <option value="">Choose a partner...</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Workshop Name */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Workshop Identity
            </label>
            <input
              required
              type="text"
              className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-rose-500 focus:bg-white transition-all placeholder:text-gray-300"
              placeholder="e.g. Alpha Operations Hub"
              value={form.workshopName}
              onChange={(e) => setForm({ ...form, workshopName: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Operational Context
            </label>
            <textarea
              required
              rows={4}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-rose-500 focus:bg-white transition-all placeholder:text-gray-300 resize-none"
              placeholder="Describe the primary objectives of this unit..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full group relative overflow-hidden bg-[#1A1A1A] text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all duration-300 hover:shadow-2xl hover:shadow-rose-200"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Deploy Workshop Unit
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="group-hover:translate-x-1 transition-transform">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-rose-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>

        </form>

        {/* Subtle Footer Decor */}
        <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-rose-500" />
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <div className="w-1 h-1 rounded-full bg-gray-200" />
          </div>
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
            System Protocol 4.0.2
          </span>
        </div>
      </div>
    </div>
  );
}