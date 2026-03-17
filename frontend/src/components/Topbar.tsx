"use client";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Topbar() {
const { user, setUser } = useAuth();
  const router = useRouter();


  const logout = async () => {
    try {
      await api.post("/auth/logout");
       setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="h-20 bg-white border-b border-gray-100 px-8 flex justify-between items-center sticky top-0 z-30 shadow-sm">
      
      {/* Title Section */}
      <div className="flex items-center gap-4">
        <div className="h-8 w-[2px] bg-rose-500 rounded-full hidden md:block" />
        <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
          Team Dashboard
        </h1>
      </div>

      {/* User Actions Section */}
      <div className="flex items-center gap-6">
        
        {/* User Info with Status */}
        <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#1A1A1A] leading-none">
              {user?.name || "Admin User"}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
              Active Now
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-rose-500 font-bold">
            {user?.name?.[0].toUpperCase() || "A"}
          </div>
        </div>

        {/* Enhanced Logout Button */}
        <button
          onClick={logout}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-rose-500 transition-all duration-200"
        >
          <span>Logout</span>
          <div className="p-2 rounded-lg group-hover:bg-rose-50 transition-colors">
            <svg 
              width="18" height="18" 
              viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
        </button>

      </div>

    </div>
  );
}