// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/lib/api";

// export default function MembersPanel({ workshopId, workshop }: any) {

//   const [members, setMembers] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [selected, setSelected] = useState("");

//   useEffect(() => {
//     if (workshopId) {
//       fetchMembers();
//       fetchUsers();
//     }
//   }, [workshopId]);

//   const fetchMembers = async () => {

//     const res = await api.get(`/workshops/${workshopId}`);

//     setMembers(res.data.data.members || []);

//   };

//   const fetchUsers = async () => {

//     const res = await api.get("/users");

//     setUsers(res.data.data || []);

//   };

//   const addMember = async () => {

//     if (!selected) return;

//     await api.post(`/workshops/${workshopId}/members`, {
//       members: [selected]
//     });

//     setSelected("");

//     fetchMembers();

//   };

//   /* 🔥 MAKE TL */

//   const makeTL = async (userId:string) => {

//     await api.post(`/workshops/${workshopId}/teamlead`,{
//       userId
//     });

//     fetchMembers();

//   };

//   /* 🔥 REMOVE TL */

//   const removeTL = async (userId:string) => {

//     await api.post(`/workshops/${workshopId}/remove-teamlead`,{
//       userId
//     });

//     fetchMembers();

//   };

//   return (

//     <div className="border p-4 rounded-lg space-y-4">

//       <h2 className="font-semibold text-lg">
//         Members
//       </h2>

//       {/* Members List */}

//       <div className="space-y-2">

//         {members.length === 0 && (
//           <p className="text-sm text-gray-500">
//             No members yet
//           </p>
//         )}

//         {members.map((m: any) => {

//           let role = "Member";

//           const isTL =
//             workshop?.teamLeads?.some((u:any)=>u._id === m._id);

//           const isWriter =
//             workshop?.writers?.some((u:any)=>u._id === m._id);

//           const isEditor =
//             workshop?.editors?.some((u:any)=>u._id === m._id);

//           if (isTL) role = "TL";
//           else if (isWriter) role = "Writer";
//           else if (isEditor) role = "Editor";

//           return (

//             <div
//               key={m._id}
//               className="border rounded-lg p-3 flex justify-between items-center"
//             >

//               <div>

//                 <p className="font-semibold">
//                   {m.name}
//                 </p>

//                 <p className="text-xs text-gray-500">
//                   {m.userCode}
//                 </p>

//               </div>

//               <div className="flex items-center gap-3">

//                 <span className="text-xs bg-gray-200 px-2 py-1 rounded">
//                   {role}
//                 </span>

//                 {!isTL && (
//                   <button
//                     onClick={()=>makeTL(m._id)}
//                     className="text-xs text-blue-600"
//                   >
//                     Make TL
//                   </button>
//                 )}

//                 {isTL && (
//                   <button
//                     onClick={()=>removeTL(m._id)}
//                     className="text-xs text-red-600"
//                   >
//                     Remove TL
//                   </button>
//                 )}

//               </div>

//             </div>

//           );

//         })}

//       </div>

//       {/* Add Member UI */}

//       <div className="flex gap-2">

//         <select
//           value={selected}
//           onChange={(e) => setSelected(e.target.value)}
//           className="border p-2 rounded"
//         >

//           <option value="">
//             Select user
//           </option>

//           {users.map((u: any) => (

//             <option key={u._id} value={u._id}>
//               {u.name}
//             </option>

//           ))}

//         </select>

//         <button
//           onClick={addMember}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >

//           Add

//         </button>

//       </div>

//     </div>

//   );

// }



"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function MembersPanel({ workshopId, workshop }: any) {
  const [members, setMembers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (workshopId) {
      fetchMembers();
      fetchUsers();
    }
  }, [workshopId]);

  const fetchMembers = async () => {
    try {
      const res = await api.get(`/workshops/${workshopId}`);
      setMembers(res.data.data.members || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addMember = async () => {
    if (!selected) return;
    await api.post(`/workshops/${workshopId}/members`, {
      members: [selected]
    });
    setSelected("");
    fetchMembers();
  };

  const makeTL = async (userId: string) => {
    await api.post(`/workshops/${workshopId}/teamlead`, { userId });
    fetchMembers();
  };

  const removeTL = async (userId: string) => {
    await api.post(`/workshops/${workshopId}/remove-teamlead`, { userId });
    fetchMembers();
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full">
      
      {/* Header Section */}
      <div className="bg-[#1A1A1A] p-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">Personnel</h2>
          <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1 italic">Authorized Access Only</p>
        </div>
        <div className="flex -space-x-2">
           {members.slice(0, 3).map((m, i) => (
             <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-400">
               {m.name.charAt(0)}
             </div>
           ))}
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
        
        {/* Members List */}
        <div className="space-y-3">
          {members.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No active personnel assigned</p>
            </div>
          ) : (
            members.map((m: any) => {
              let role = "Member";
              let roleClass = "bg-gray-100 text-gray-500";
              
              const isTL = workshop?.teamLeads?.some((u: any) => u._id === m._id);
              const isWriter = workshop?.writers?.some((u: any) => u._id === m._id);
              const isEditor = workshop?.editors?.some((u: any) => u._id === m._id);

              if (isTL) { role = "Lead"; roleClass = "bg-rose-500 text-white shadow-lg shadow-rose-200"; }
              else if (isWriter) { role = "Writer"; roleClass = "bg-blue-100 text-blue-600"; }
              else if (isEditor) { role = "Editor"; roleClass = "bg-emerald-100 text-emerald-600"; }

              return (
                <div key={m._id} className="group bg-gray-50/50 border border-gray-100 p-4 rounded-2xl flex justify-between items-center transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
                  
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${isTL ? 'bg-rose-600 text-white' : 'bg-white text-slate-400 border border-gray-100'}`}>
                      {m.name.split(' ').map((n:any) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1 group-hover:text-rose-600 transition-colors">
                        {m.name}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        ID: {m.userCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${roleClass}`}>
                      {role}
                    </span>

                    {/* Action Buttons */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      {!isTL ? (
                        <button
                          onClick={() => makeTL(m._id)}
                          className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                          title="Promote to TL"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 19V5m-7 7l7-7 7 7"/></svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => removeTL(m._id)}
                          className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                          title="Revoke TL Status"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14m-7-7l7 7 7-7"/></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Member Quick-Bar */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-rose-500 appearance-none cursor-pointer"
            >
              <option value="">Recruit User...</option>
              {users.map((u: any) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>

          <button
            onClick={addMember}
            disabled={!selected}
            className="bg-[#1A1A1A] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 disabled:opacity-30 transition-all flex items-center gap-2"
          >
            Deploy
          </button>
        </div>
      </div>
    </div>
  );
}