"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {

  return (
    <ProtectedRoute>

      <div className="text-3xl font-bold">
        TL Dashboard
      </div>

    </ProtectedRoute>
  );
}