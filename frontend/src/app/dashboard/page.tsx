"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import TLStatsCards from "@/components/dashboard/TLStatsCards";
import RiskTrendChart from "@/components/dashboard/RiskTrendChart";
import EscalationPanel from "@/components/dashboard/EscalationPanel";
import TaskTable from "@/components/dashboard/TaskTable";
import TaskFilters from "@/components/dashboard/TaskFilters";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

interface RiskStats {
  totalTasks: number;
  safe: number;
  atRisk: number;
  highRisk: number;
  overdue: number;
  riskScore: number;
}

interface Task {
  _id: string;
  title: string;
  status: string;
  slaStatus: "SAFE" | "AT_RISK" | "OVERDUE";
  assignedTo?: {
    name: string;
  };
  createdAt?: string;
}

// const riskData = [
//   { day: "Mon", risk: 20 },
//   { day: "Tue", risk: 35 },
//   { day: "Wed", risk: 25 },
//   { day: "Thu", risk: 50 },
//   { day: "Fri", risk: 40 },
// ];

function buildRiskChart(tasks: any[]) {
  const map: Record<string, number> = {};

  tasks.forEach((task) => {
    const day = new Date(task.createdAt).toLocaleDateString("en-US", {
      weekday: "short",
    });

    if (!map[day]) map[day] = 0;

    if (task.slaStatus === "AT_RISK" || task.slaStatus === "OVERDUE") {
      map[day] += 1;
    }
  });

  return Object.entries(map).map(([day, risk]) => ({
    day,
    risk,
  }));
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");

  useEffect(() => {
    fetchStats();
    fetchTasks();
    socket.on("NEW_ESCALATION", fetchStats);
    socket.on("TASK_UPDATED", fetchTasks);
    return () => {
      socket.off("NEW_ESCALATION");
      socket.off("TASK_UPDATED");
    };
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/risk");
      setStats(res.data.data);
    } catch (err) { console.log(err); }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.data);
    } catch (err) { console.log(err); }
  };

  if (!stats) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = !statusFilter || task.status === statusFilter;
    const riskMatch = !riskFilter || task.slaStatus === riskFilter;
    return statusMatch && riskMatch;
  });

  const escalations = tasks
    .filter((t) => t.slaStatus === "OVERDUE")
    .slice(0, 5)
    .map((t) => ({ id: t._id, taskTitle: t.title, riskLevel: "OVERDUE" as const }));

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20">
      
      {/* 1. Stats Section - Top Priority */}
      <section>
        <TLStatsCards
          totalTasks={stats.totalTasks}
          safeTasks={stats.safe}
          atRiskTasks={stats.atRisk}
          overdueTasks={stats.overdue}
        />
      </section>

      {/* 2. Middle Row: Analytics & Activity */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left & Center: Chart & Feed */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[420px]">
              <RiskTrendChart data={buildRiskChart(tasks)} />
           </div>
           <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[420px]">
              <ActivityFeed />
           </div>
        </div>

        {/* Right: Escalations */}
        <div className="xl:col-span-4 h-full">
          <EscalationPanel escalations={escalations} />
        </div>
      </section>

      {/* 3. Operational Section: Filters & Table */}
      <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">Task Inventory</h2>
          <TaskFilters
            status={statusFilter}
            risk={riskFilter}
            onStatusChange={setStatusFilter}
            onRiskChange={setRiskFilter}
          />
        </div>
        <div className="p-2">
          <TaskTable tasks={filteredTasks} />
        </div>
      </section>

      {/* 4. Kanban Section */}
      {/* <section className="pt-4">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-2 h-6 bg-rose-500 rounded-full" />
          <h2 className="text-xl font-bold text-slate-900">Workflow Board</h2>
        </div>
        <KanbanBoard tasks={tasks} reload={fetchTasks} />
      </section> */}

    </div>
  );
}