"use client";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import logo from "../../public/image/SociyoLogo.png";
import Image from "next/image";
import { LogOut, Bell, ChevronDown } from "lucide-react";

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
    <nav className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 flex justify-between items-center sticky top-0 z-[40] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] transition-all">
      
      {/* Left: Branding (Mobile pe margin-left diya hai taaki hamburger button ki jagah bane) */}
      <div className="flex items-center gap-4 ml-12 lg:ml-0">
        <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
          <div className="bg-[#1A1A1A] p-2.5 md:mt-0 mt-3 md:p-2 rounded-xl md:rounded-2xl shadow-lg shadow-black/5 transform group-hover:scale-105 transition-transform duration-300">
            <Image 
              src={logo} 
              alt="Sociyo Logo" 
              width={40} 
              height={40} 
              className="object-contain md:w-[52px] md:h-[52px]"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base md:text-lg font-black text-[#1A1A1A] tracking-tighter uppercase italic leading-none">
              Sociyo
            </h1>
            <p className="text-[9px] md:text-[10px] text-rose-500 font-bold tracking-[0.15em] mt-0.5 uppercase">
              Dashboard
            </p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-[1px] bg-gray-200 hidden md:block" />
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-1 md:gap-3">
        
        {/* Notifications Icon */}
        <button className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all relative">
          <Bell size={18} className="md:w-[20px] md:h-[20px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        {/* User Profile Card */}
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-gray-100 group cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-[#1A1A1A] leading-none group-hover:text-rose-500 transition-colors">
              {user?.name || "Admin User"}
            </p>
            <p className="text-[9px] text-green-500 font-semibold uppercase tracking-wider mt-1 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Online
            </p>
          </div>
          
          <div className="relative">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-bold shadow-md shadow-rose-200 group-hover:rotate-3 transition-transform text-sm md:text-base">
              {user?.name?.[0].toUpperCase() || "A"}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-lg border border-gray-100 text-gray-400 group-hover:text-[#1A1A1A] hidden sm:block">
              <ChevronDown size={10} />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="ml-2 md:ml-4 p-2 md:p-2.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 active:scale-95"
          title="Logout"
        >
          <LogOut size={20} className="md:w-[22px] md:h-[22px]" />
        </button>

      </div>
    </nav>
  );
}