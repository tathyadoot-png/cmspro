"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ShieldCheck, UserPlus, Users, Terminal } from "lucide-react"; // Make sure to install lucide-react

export default function TLPanel({ workshopId }: any) {
  const [teamLeads, setTeamLeads] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (workshopId) {
      fetchWorkshop();
    }
  }, [workshopId]);

  const fetchWorkshop = async () => {
    try {
      const res = await api.get(`/workshops/${workshopId}`);
      const data = res.data.data;
      setTeamLeads(data.teamLeads || []);
      setMembers(data.members || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addTL = async () => {
    if (!selected) return;
    try {
      await api.post(`/workshops/${workshopId}/teamlead`, {
        userId: selected,
      });
      fetchWorkshop();
      setSelected("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-gray-200/50">
      
      {/* Header with Dark Mode aesthetic */}
      <div className="bg-[#1A1A1A] p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            {/* <Terminal className="text-white w-5 h-5" /> */}
          </div>
          <div>
            <h2 className="text-white font-bold text-lg tracking-tight">Command Center</h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Authority Management</p>
          </div>
        </div>
        {/* <div className="flex -space-x-2">
            {teamLeads.slice(0, 3).map((u) => (
                <div key={u._id} className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] bg-gray-700 flex items-center justify-center text-[10px] text-white font-bold">
                    {u.name.charAt(0)}
                </div>
            ))}
        </div> */}
      </div>

      {/* Team Leads List */}
      <div className="p-6 flex-1 space-y-4 overflow-y-auto custom-scrollbar bg-gray-50/50">
        <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active Leadership</span>
        </div>

        {teamLeads.length > 0 ? (
          teamLeads.map((u: any) => (
            <div 
              key={u._id} 
              className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-emerald-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{u.name}</p>
                  <p className="text-[10px] text-gray-400">System Authorized Lead</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-emerald-100/50 text-emerald-700 text-[10px] font-black rounded-full uppercase">
                Lead
              </div>
            </div>
          ))
        ) : (
          <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl">
             <Users className="text-gray-300 w-8 h-8 mb-2" />
             <p className="text-gray-400 text-xs italic">No leads assigned yet</p>
          </div>
        )}
      </div>

      {/* Promotion Section */}
      {members.length > 0 && (
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-4 h-4 text-indigo-500" />
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Elevate Personnel</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                >
                <option value="">Select Member...</option>
                {members.map((u: any) => (
                    <option key={u._id} value={u._id}>
                    {u.name}
                    </option>
                ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 7.293 8.172 5.858 9.607 10 13.733z"/></svg>
                </div>
            </div>

            <button
              onClick={addTL}
              disabled={!selected}
              className="bg-black hover:bg-zinc-800 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg shadow-black/10 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Promote
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}