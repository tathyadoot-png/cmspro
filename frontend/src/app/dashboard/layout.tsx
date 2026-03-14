"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ProtectedRoute>

      <div className="flex h-screen">

        <Sidebar />

        <div className="flex-1 flex flex-col">

          <Topbar />

          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>

        </div>

      </div>

    </ProtectedRoute>
  );
}