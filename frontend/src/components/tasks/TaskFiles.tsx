"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";

export default function TaskFiles({ taskId }: any) {
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const form = new FormData();
      form.append("file", file);
      await api.post(`/tasks/${taskId}/files`, form);
      setFile(null);
      // Success feedback logic here
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-[2rem] p-8 text-center cursor-pointer transition-all ${
          file ? "border-emerald-400 bg-emerald-50/30" : "border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-white"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        
        <div className="space-y-2">
          <div className="mx-auto w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            {file ? file.name : "Select Asset"}
          </p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
            PDF, PNG, JPG (MAX 10MB)
          </p>
        </div>
      </div>

      {/* Action Button */}
      {file && (
        <button
          disabled={uploading}
          onClick={uploadFile}
          className={`w-full py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg ${
            uploading 
              ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
              : "bg-slate-900 text-white hover:bg-rose-600 shadow-rose-200"
          }`}
        >
          {uploading ? "Transmitting..." : "Upload Asset"}
        </button>
      )}

      {/* Info Tag */}
      <div className="flex items-center gap-2 px-2 text-slate-400">
        <div className="w-1 h-1 bg-amber-500 rounded-full" />
        <p className="text-[9px] font-black uppercase italic tracking-widest">Storage encrypted</p>
      </div>
    </div>
  );
}