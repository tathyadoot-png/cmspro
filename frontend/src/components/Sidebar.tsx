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
    <div className="w-64 bg-card border-r flex flex-col">

      <div className="p-6 font-bold text-lg">
        CMS Pro
      </div>

      <nav className="flex flex-col gap-1 px-4">

        {navigation.map((item) => {

          if (!hasPermission(user, item.permission)) return null;

          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`px-3 py-2 rounded-md text-sm ${active
                  ? "bg-primary text-red-600"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}