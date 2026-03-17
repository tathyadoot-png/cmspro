"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data.data);
    } catch (err) {
      console.error("Fetch Roles Error:", err);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await api.get("/permissions");
      setPermissions(res.data.data);
    } catch (err) {
      console.error("Fetch Permissions Error:", err);
    }
  };

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!name) return;
    await api.post("/roles", { name, permissions: selectedPermissions });
    resetForm();
    fetchRoles();
  };

  const handleEdit = (role: any) => {
    setName(role.name);
    setEditingId(role._id);
    const permissionIds = role.permissions?.map((p: any) =>
      typeof p === "object" ? p._id : p
    );
    setSelectedPermissions(permissionIds || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async () => {
    await api.put(`/roles/${editingId}`, { name, permissions: selectedPermissions });
    resetForm();
    fetchRoles();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      await api.delete(`/roles/${id}`);
      fetchRoles();
    }
  };

  const resetForm = () => {
    setName("");
    setSelectedPermissions([]);
    setEditingId(null);
  };

  return (
    <div className="p-10 max-w-[1400px] mx-auto min-h-screen bg-[#FDFDFD] space-y-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-rose-500 rounded-full" />
          <h1 className="text-5xl font-black text-slate-900 tracking-tightest leading-none uppercase">
            Access<span className="text-rose-600">Control</span>
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-tighter rounded">SECURE</span>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.4em]">
              Permissions & Role Management
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        
        {/* Left: Form Panel */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-xl overflow-hidden">
            <div className="bg-[#1A1A1A] px-8 py-5 border-b border-white/5">
              <h2 className="text-lg font-black text-white tracking-tight uppercase">
                {editingId ? "Modify Role" : "Initialize New Role"}
              </h2>
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mt-0.5 italic">
                {editingId ? `System ID: ${editingId}` : "Protocol: Assignment"}
              </p>
            </div>

            <div className="p-8 space-y-8">
              {/* Role Name Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Label</label>
                <div className="relative flex items-center bg-gray-50 border border-gray-200 p-1.5 rounded-2xl focus-within:border-rose-500/50 focus-within:ring-4 focus-within:ring-rose-500/5 transition-all">
                  <input
                    className="flex-1 bg-transparent px-4 py-3 text-sm font-bold text-slate-700 outline-none placeholder:text-gray-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter role designation..."
                  />
                </div>
              </div>

              {/* Permissions Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Matrix</label>
                  <div className="flex gap-4">
                    <button onClick={() => setSelectedPermissions(permissions.map(p => p._id))} className="text-[9px] font-black text-rose-500 uppercase hover:underline">Select All</button>
                    <button onClick={() => setSelectedPermissions([])} className="text-[9px] font-black text-gray-400 uppercase hover:underline">Clear</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {permissions.map((p) => {
                    const isSelected = selectedPermissions.includes(p._id);
                    return (
                      <div
                        key={p._id}
                        onClick={() => togglePermission(p._id)}
                        className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                          isSelected ? 'bg-rose-50 border-rose-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <span className={`text-[11px] font-black uppercase tracking-tight transition-colors ${isSelected ? 'text-rose-600' : 'text-slate-600'}`}>
                          {p.name}
                        </span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          isSelected ? 'bg-rose-600 border-rose-600' : 'bg-transparent border-gray-200'
                        }`}>
                          {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  className="flex-1 bg-[#1A1A1A] text-white px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-rose-600 transition-all duration-300 shadow-lg shadow-gray-200"
                >
                  {editingId ? "Sync Changes" : "Confirm Deployment"}
                </button>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Roles List */}
        <div className="xl:col-span-7">
          <div className="grid grid-cols-1 gap-6">
            {roles.map((r, index) => (
              <div
                key={r._id}
                className="group relative bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden"
              >
                 {/* ID Counter Background */}
                 <span className="absolute -right-4 -top-6 text-8xl font-black text-slate-50 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                  0{index + 1}
                </span>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500">
                        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-slate-800 tracking-tight group-hover:text-rose-600 transition-colors">
                          {r.name}
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Authorized Personnel Unit
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {r.permissions?.map((p: any) => (
                        <span key={p._id} className="text-[8px] font-black bg-gray-50 text-slate-500 px-3 py-1 rounded-full border border-gray-100 uppercase tracking-tighter">
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleEdit(r)}
                      className="flex-1 md:flex-none bg-slate-50 text-slate-900 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="p-3 rounded-xl border border-gray-100 text-gray-300 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}