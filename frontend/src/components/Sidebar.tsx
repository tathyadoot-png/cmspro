"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { navigation } from "@/config/navigation";
import { hasPermission } from "@/lib/permissions";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="w-72 bg-[#0A0A0A] border-r border-white/5 flex flex-col h-screen sticky top-0">
      
      {/* Branding Section */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#E11D48] rounded-lg flex items-center justify-center shadow-lg shadow-rose-500/20">
             <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white italic">
            CMS<span className="text-[#E11D48] not-italic">Pro</span>
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5 px-4 overflow-y-auto">
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
              className={`group relative flex items-center px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 ${
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
      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10 flex items-center justify-center text-[12px] font-bold text-gray-300">
            {user?.email?.[0].toUpperCase() || "A"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">Admin Panel</span>
            <span className="text-[10px] text-gray-500 truncate">{user?.email}</span>
          </div>
        </div>
      </div>

    </div>
  );
}