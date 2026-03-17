"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TLPanel({ workshopId }: any) {
  const [teamLeads, setTeamLeads] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetchTL();
    fetchUsers();
  }, [workshopId]);

  const fetchTL = async () => {
    try {
      const res = await api.get(`/workshops/${workshopId}`);
      setTeamLeads(res.data.data.teamLeads || []);
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

  const addTL = async () => {
    if (!selected) return;
    try {
      await api.post(`/workshops/${workshopId}/teamleads`, {
        teamLeads: [selected]
      });
      fetchTL();
      setSelected("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full">
      
      {/* Leadership Header */}
      <div className="bg-[#1A1A1A] p-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">Command Center</h2>
          <p className="text-[9px] text-amber-500 font-black uppercase tracking-[0.2em] mt-1 italic">Authorized Team Leads</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <svg className="text-amber-500" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
        {teamLeads.length === 0 ? (
          <div className="text-center py-10 opacity-40">
            <p className="text-[10px] font-black uppercase tracking-widest">No leads assigned</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {teamLeads.map((u: any) => (
              <div 
                key={u._id} 
                className="group flex items-center justify-between bg-gray-50 border border-gray-100 p-4 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] text-amber-500 flex items-center justify-center text-[10px] font-black border border-white/5">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 leading-none">{u.name}</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Active Lead</p>
                  </div>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recruitment Bar */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-700 outline-none focus:border-amber-500 appearance-none cursor-pointer"
            >
              <option value="">Select Candidate...</option>
              {users.map((u: any) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>

          <button
            onClick={addTL}
            disabled={!selected}
            className="bg-[#1A1A1A] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 disabled:opacity-20 transition-all flex items-center gap-2"
          >
            Promote
          </button>
        </div>
      </div>
    </div>
  );
}