"use client";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Topbar() {

  const { user } = useAuth();
  const router = useRouter();

  const logout = async () => {

    await api.post("/auth/logout");

    router.push("/login");

  };

  return (
    <div className="bg-card p-4 flex justify-between items-center border-b">

      <h1 className="text-lg font-semibold">
        Team Dashboard
      </h1>

      <div className="flex items-center gap-4">

        <span className="text-sm">
          {user?.name}
        </span>

        <button
          onClick={logout}
          className="text-sm text-red-500"
        >
          Logout
        </button>

      </div>

    </div>
  );
}