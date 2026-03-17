// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";

// export default function ClientsPage(){

// const [clients,setClients] = useState<any[]>([]);
// const [name,setName] = useState("");
// const [clientType,setClientType] = useState("CORPORATE");
// const [editingId,setEditingId] = useState<string | null>(null);

// useEffect(()=>{
//  fetchClients();
// },[]);

// const fetchClients = async ()=>{
//  const res = await api.get("/clients");
//  setClients(res.data.data);
// };

// const handleCreate = async ()=>{

//  if(!name) return;

//  await api.post("/clients",{
//   name,
//   clientType
//  });

//  setName("");
//  fetchClients();
// };

// const handleDelete = async(id:string)=>{

//  await api.delete(`/clients/${id}`);
//  fetchClients();

// };

// const handleEdit = (client:any)=>{

//  setName(client.name);
//  setClientType(client.clientType);
//  setEditingId(client._id);

// };

// const handleUpdate = async ()=>{

//  if(!editingId) return;

//  await api.put(`/clients/${editingId}`,{
//   name,
//   clientType
//  });

//  setEditingId(null);
//  setName("");
//  fetchClients();

// };

// return(

// <div className="space-y-6">

// <h1 className="text-xl font-semibold">
// Clients
// </h1>

// <div className="flex gap-2">

// <input
// className="border p-2 rounded w-60"
// placeholder="Client name"
// value={name}
// onChange={(e)=>setName(e.target.value)}
// />

// <select
// className="border p-2 rounded"
// value={clientType}
// onChange={(e)=>setClientType(e.target.value)}
// >
// <option value="CORPORATE">Corporate</option>
// <option value="POLITICAL">Political</option>
// </select>

// {editingId ? (

// <button
// className="bg-green-600 text-white px-4 py-2 rounded"
// onClick={handleUpdate}
// >
// Update
// </button>

// ) : (

// <button
// className="bg-primary text-red-600 px-4 py-2 rounded"
// onClick={handleCreate}
// >
// Add Client
// </button>

// )}

// </div>

// <table className="w-full text-sm border">

// <thead>

// <tr className="border-b bg-gray-100">
// <th className="p-2 text-left">Client Name</th>
// <th className="p-2 text-left">Type</th>
// <th className="p-2 text-left">Actions</th>
// </tr>

// </thead>

// <tbody>

// {clients.map((c)=>(
// <tr key={c._id} className="border-b">

// <td className="p-2">
// {c.name}
// </td>

// <td className="p-2">
// <span className="px-2 py-1 text-xs rounded bg-gray-200">
// {c.clientType}
// </span>
// </td>

// <td className="p-2 flex gap-3">

// <button
// className="text-blue-600"
// onClick={()=>handleEdit(c)}
// >
// Edit
// </button>

// <button
// className="text-red-600"
// onClick={()=>handleDelete(c._id)}
// >
// Delete
// </button>

// </td>

// </tr>
// ))}

// </tbody>

// </table>

// </div>

// );

// }



"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [clientType, setClientType] = useState("CORPORATE");
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleCreate = async () => {
    if (!name) return;
    await api.post("/clients", { name, clientType });
    setName("");
    fetchClients();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/clients/${id}`);
    fetchClients();
  };

  const handleEdit = (client: any) => {
    setName(client.name);
    setClientType(client.clientType);
    setEditingId(client._id);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    await api.put(`/clients/${editingId}`, { name, clientType });
    setEditingId(null);
    setName("");
    fetchClients();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em]">Database</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Clients Directory</h1>
        </div>

        {/* Input Bar */}
        <div className={`flex flex-wrap items-center gap-3 p-3 rounded-[2rem] border-2 transition-all duration-500 ${editingId ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-100 bg-white shadow-xl shadow-gray-200/40'}`}>
          <div className="relative">
            <input
              className="bg-transparent px-4 py-2 text-sm font-bold text-slate-700 outline-none w-64 placeholder:text-slate-300"
              placeholder="Client entity name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="h-6 w-[1px] bg-gray-200 hidden md:block" />

          <select
            className="bg-transparent px-2 py-2 text-[11px] font-black text-slate-500 uppercase tracking-widest outline-none cursor-pointer"
            value={clientType}
            onChange={(e) => setClientType(e.target.value)}
          >
            <option value="CORPORATE">Corporate</option>
            <option value="POLITICAL">Political</option>
          </select>

          {editingId ? (
            <button
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
              onClick={handleUpdate}
            >
              Update Registry
            </button>
          ) : (
            <button
              className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-gray-200"
              onClick={handleCreate}
            >
              Add Client
            </button>
          )}

          {editingId && (
            <button 
              onClick={() => { setEditingId(null); setName(""); }}
              className="text-[9px] font-black text-rose-500 uppercase tracking-widest px-2"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Entity Identity</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Classification</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clients.map((c) => (
              <tr key={c._id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs group-hover:bg-white group-hover:text-rose-600 transition-all duration-300">
                      {c.name.charAt(0)}
                    </div>
                    <p className="font-black text-slate-800 tracking-tight group-hover:translate-x-1 transition-transform">{c.name}</p>
                  </div>
                </td>

                <td className="px-8 py-6">
                  <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${
                    c.clientType === 'POLITICAL' 
                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                    : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {c.clientType}
                  </span>
                </td>

                <td className="px-8 py-6">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"
                      onClick={() => handleEdit(c)}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button
                      className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-rose-600 shadow-sm transition-all"
                      onClick={() => handleDelete(c._id)}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {clients.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Directory is currently empty</p>
          </div>
        )}
      </div>
    </div>
  );
}