"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { navigation } from "@/config/navigation";
import { hasPermission } from "@/lib/permissions";
import logo from "../../public/image/SociyoLogo.png";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle state

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* --- Mobile Hamburger Button --- */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white shadow-lg shadow-rose-500/10 active:scale-95 transition-all"
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        )}
      </button>

      {/* --- Mobile Overlay --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* --- Main Sidebar Container --- */}
      <div className={`
        fixed inset-y-0 left-0 z-[45] w-72 bg-[#0A0A0A] border-r border-white/5 flex flex-col h-screen transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:sticky lg:top-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* Branding Section */}
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl tracking-tight text-white italic">
              <Image 
                src={logo} 
                alt="Sociyo Logo" 
                width={80} 
                height={80} 
                className="object-contain" 
                priority
              />
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1.5 px-4 overflow-y-auto custom-scrollbar">
          <div className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            Main Menu
          </div>

          {navigation.map((item) => {
            if (!hasPermission(user, item.permission)) return null;

            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)} // Mobile par click karte hi menu close ho jaye
                className={`group relative flex items-center px-4 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                  active
                    ? "bg-white/5 text-white shadow-inner"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {/* Active Indicator Line */}
                {active && (
                  <div className="absolute left-0 w-1 h-5 bg-[#E11D48] rounded-r-full" />
                )}
                
                <span className={`transition-transform duration-200 ${active ? "translate-x-1" : "group-hover:translate-x-1"}`}>
                  {item.label}
                </span>

                {/* Subtle arrow for hover state */}
                {!active && (
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-600">
                      <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile Section */}
        <div className="p-6 border-t border-white/5 bg-black/20 mt-auto">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10 flex items-center justify-center text-[12px] font-bold text-gray-300 flex-shrink-0">
              {user?.email?.[0].toUpperCase() || "A"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-white truncate">Admin Panel</span>
              <span className="text-[10px] text-gray-500 truncate">{user?.email}</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}