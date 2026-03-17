// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";
// import Link from "next/link";

// export default function UsersPage() {

//   const [users, setUsers] = useState<any[]>([]);
//   const [roles, setRoles] = useState<any[]>([]);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
//   const [editingId, setEditingId] = useState<string | null>(null);

//   useEffect(() => {
//     fetchUsers();
//     fetchRoles();
//   }, []);

//   const fetchUsers = async () => {

//     const res = await api.get("/users");

//     setUsers(res.data.data);

//   };

//   const fetchRoles = async () => {

//     const res = await api.get("/roles");

//     setRoles(res.data.data);

//   };

//   const toggleRole = (roleId: string) => {

//     if (selectedRoles.includes(roleId)) {

//       setSelectedRoles(
//         selectedRoles.filter(r => r !== roleId)
//       );

//     } else {

//       setSelectedRoles([
//         ...selectedRoles,
//         roleId
//       ]);

//     }

//   };

//   const resetForm = () => {

//     setName("");
//     setEmail("");
//     setPassword("");
//     setSelectedRoles([]);
//     setEditingId(null);

//   };

//   const handleCreate = async () => {

//     await api.post("/users", {
//       name,
//       email,
//       password,
//       roles: selectedRoles
//     });

//     resetForm();
//     fetchUsers();

//   };

//   const handleEdit = (user: any) => {

//     setEditingId(user._id);

//     setName(user.name);
//     setEmail(user.email);

//     const roleIds = user.roles.map(
//       (r: any) => r._id
//     );

//     setSelectedRoles(roleIds);

//   };

//   const handleUpdate = async () => {

//     if (!editingId) return;

//     await api.put(`/users/${editingId}`, {
//       name,
//       email,
//       roles: selectedRoles
//     });

//     resetForm();
//     fetchUsers();

//   };

//   const handleDelete = async (id: string) => {

//     await api.delete(`/users/${id}`);

//     fetchUsers();

//   };

//   return (

//     <div className="space-y-6">

//       <h1 className="text-xl font-semibold">
//         Users
//       </h1>

//       {/* USER FORM */}

//       <div className="border p-4 rounded space-y-3">

//         <input
//           className="border p-2 w-full"
//           placeholder="Name"
//           value={name}
//           onChange={(e)=>setName(e.target.value)}
//         />

//         <input
//           className="border p-2 w-full"
//           placeholder="Email"
//           value={email}
//           onChange={(e)=>setEmail(e.target.value)}
//         />

//         {!editingId && (

//           <input
//             className="border p-2 w-full"
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e)=>setPassword(e.target.value)}
//           />

//         )}

//         {/* Roles */}

//         <div>

//           <p className="font-medium">
//             Roles
//           </p>

//           <div className="flex gap-3 flex-wrap">

//             {roles.map((r)=>(
//               <label
//                 key={r._id}
//                 className="flex gap-1 items-center"
//               >

//                 <input
//                   type="checkbox"
//                   checked={
//                     selectedRoles.includes(r._id)
//                   }
//                   onChange={()=>toggleRole(r._id)}
//                 />

//                 {r.name}

//               </label>
//             ))}

//           </div>

//         </div>

//         {editingId ? (

//           <button
//             className="bg-green-600 text-white px-4 py-2 rounded"
//             onClick={handleUpdate}
//           >
//             Update User
//           </button>

//         ) : (

//           <button
//             className="bg-primary text-white px-4 py-2 rounded"
//             onClick={handleCreate}
//           >
//             Create User
//           </button>

//         )}

//       </div>

//       {/* USERS TABLE */}

//       <table className="w-full text-sm border">

//         <thead>

//           <tr className="border-b">

//             <th className="p-2 text-left">
//               Code
//             </th>

//             <th className="p-2 text-left">
//               Name
//             </th>

//             <th className="p-2 text-left">
//               Email
//             </th>

//             <th className="p-2 text-left">
//               Roles
//             </th>

//             <th className="p-2 text-left">
//               Actions
//             </th>

//           </tr>

//         </thead>

//         <tbody>

//           {users.map((u)=>(
//             <tr key={u._id} className="border-b">

//               <td className="p-2">
//                 {u.userCode}
//               </td>

//               <td className="p-2">
//                 {u.name}
//               </td>

//               <td className="p-2">
//                 {u.email}
//               </td>

//               <td className="p-2">
//                 {u.roles
//                   ?.map((r:any)=>r.name)
//                   .join(", ")}
//               </td>

//               <td className="p-2 flex gap-3">

//                 <button
//                   className="text-blue-600"
//                   onClick={()=>handleEdit(u)}
//                 >
//                   Edit
//                 </button>

//                 <button
//                   className="text-red-600"
//                   onClick={()=>handleDelete(u._id)}
//                 >
//                   Delete
//                 </button>

//                 {/* 🔥 USER ACTIVITY PAGE */}

//                 <Link
//                   href={`/dashboard/users/${u._id}`}
//                   className="text-purple-600"
//                 >
//                   Activity
//                 </Link>

//               </td>

//             </tr>
//           ))}

//         </tbody>

//       </table>

//     </div>

//   );

// }



"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data.data || []);
  };

  const fetchRoles = async () => {
    const res = await api.get("/roles");
    setRoles(res.data.data || []);
  };

  const toggleRole = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setSelectedRoles([]);
    setEditingId(null);
  };

  const handleCreate = async () => {
    await api.post("/users", { name, email, password, roles: selectedRoles });
    resetForm();
    fetchUsers();
  };

  const handleEdit = (user: any) => {
    setEditingId(user._id);
    setName(user.name);
    setEmail(user.email);
    const roleIds = user.roles.map((r: any) => r._id);
    setSelectedRoles(roleIds);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    await api.put(`/users/${editingId}`, { name, email, roles: selectedRoles });
    resetForm();
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure?")) {
      await api.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em]">Administration</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Identity Management</h1>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Accounts</p>
          <p className="text-xl font-black text-slate-800 tracking-tighter">{users.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: FORM CONSOLE (4 Cols) */}
        <div className="lg:col-span-4 sticky top-8">
          <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 shadow-2xl shadow-gray-200/50 ${editingId ? 'border-emerald-500 bg-emerald-50/20' : 'border-white bg-white'}`}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 mb-6 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${editingId ? 'bg-emerald-500 animate-pulse' : 'bg-rose-600'}`} />
              {editingId ? "Update Registry" : "New Registration"}
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase ml-2">Full Name</p>
                <input
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase ml-2">Email Endpoint</p>
                <input
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                  placeholder="john@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {!editingId && (
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase ml-2">Security Key</p>
                  <input
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              <div className="pt-4">
                <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest mb-3">Authority Roles</p>
                <div className="flex gap-2 flex-wrap">
                  {roles.map((r) => (
                    <button
                      key={r._id}
                      onClick={() => toggleRole(r._id)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                        selectedRoles.includes(r._id)
                          ? 'bg-[#1A1A1A] text-white border-transparent shadow-lg shadow-gray-400/30'
                          : 'bg-white text-slate-400 border-gray-100 hover:border-rose-500'
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex gap-2">
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all hover:-translate-y-1 active:scale-95 ${
                    editingId ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-[#1A1A1A] text-white shadow-gray-300'
                  }`}
                >
                  {editingId ? "Update User" : "Deploy User"}
                </button>
                {editingId && (
                  <button onClick={resetForm} className="bg-white border border-gray-100 p-4 rounded-2xl hover:bg-rose-50 group transition-all">
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: DATA TABLE (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Identity Hash</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Permissions</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u._id} className="group hover:bg-gray-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs border border-slate-200/50">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm tracking-tight">{u.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 lowercase italic">{u.email}</span>
                        <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest mt-0.5">{u.userCode}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1.5">
                      {u.roles?.map((r: any) => (
                        <span key={r._id} className="px-2 py-0.5 bg-white border border-gray-100 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-md shadow-sm">
                          {r.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => handleEdit(u)}
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="Edit User"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>

                      <Link 
                        href={`/dashboard/users/${u._id}`}
                        className="p-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                        title="View Activity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </Link>

                      <button 
                        onClick={() => handleDelete(u._id)}
                        className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        title="Remove User"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="py-20 text-center opacity-30 font-black text-[10px] uppercase tracking-[0.4em]">No Personnel Records Found</div>
          )}
        </div>
      </div>
    </div>
  );
}