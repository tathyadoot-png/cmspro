"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";

type Task = {
  _id: string;
  title: string;
  status: string;
  slaStatus: "SAFE" | "AT_RISK" | "OVERDUE";
  assignedTo?: { name: string };
  createdAt?: string;
};

type Props = {
  tasks: Task[];
};

export default function TaskTable({ tasks }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  // Pagination Logic
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const currentTasks = tasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  // Smart Pagination Numbers Logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const approveTask = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}/approve`);
      window.location.reload();
    } catch (err) { console.log(err); }
  };

  const requestRevision = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}/revision`);
      window.location.reload();
    } catch (err) { console.log(err); }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* Dark Header Section */}
            <tr className="bg-[#1A1A1A]">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-white/5">Task Details</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-white/5">Assignee</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-white/5">Status</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-white/5">Risk</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-white/5">Created At</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-white/5">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {currentTasks.map((task) => (
              <tr key={task._id} className="group hover:bg-gray-50/80 transition-all duration-200">
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-rose-600 transition-colors">{task.title}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">ID: {task._id.slice(-6)}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">
                      {task.assignedTo?.name?.slice(0, 2).toUpperCase() || "NA"}
                    </div>
                    <span className="text-sm font-bold text-slate-600">{task.assignedTo?.name || "Unassigned"}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'COMPLETED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 animate-pulse'}`} />
                    <span className="text-[11px] font-black text-slate-500 uppercase">{task.status}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${
                    task.slaStatus === "OVERDUE" ? "bg-rose-100 text-rose-600" : 
                    task.slaStatus === "AT_RISK" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                  }`}>
                    {task.slaStatus}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "N/A"}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => approveTask(task._id)} className="px-3 py-1.5 text-[10px] font-black bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all">APPROVE</button>
                    <button onClick={() => requestRevision(task._id)} className="px-3 py-1.5 text-[10px] font-black bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-all">REVISION</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 bg-[#1A1A1A] border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.1em]">
          Page {currentPage} of {totalPages || 1} — Total {tasks.length} Records
        </p>
        
        <div className="flex items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white disabled:opacity-20 transition-all"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          </button>

          <div className="flex gap-1.5 items-center">
            {getPageNumbers().map((page, idx) => (
              page === "..." ? (
                <span key={idx} className="px-1 text-gray-600 font-black">...</span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(Number(page))}
                  className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${
                    currentPage === page ? "bg-rose-600 text-white shadow-lg shadow-rose-900/40" : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white disabled:opacity-20 transition-all"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}