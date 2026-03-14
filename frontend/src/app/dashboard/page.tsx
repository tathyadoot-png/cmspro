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

  const [stats, setStats] = useState<RiskStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [statusFilter, setStatusFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");

  useEffect(() => {
    fetchStats();
    fetchTasks();

    socket.on("NEW_ESCALATION", fetchStats);

    return () => {
      socket.off("NEW_ESCALATION", fetchStats);
    };
  }, []);

useEffect(() => {

  fetchTasks();
  fetchStats();

  socket.on("TASK_UPDATED", () => {
    fetchTasks();
  });

  return () => {
    socket.off("TASK_UPDATED");
  };

}, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/risk");
      setStats(res.data.data);
    } catch (err) {
      console.log("Risk stats error", err);
    }
  };

const fetchTasks = async () => {
  try {

    const res = await api.get("/tasks");

    setTasks(res.data.data);

  } catch (err) {
    console.log("Task fetch error", err);
  }
};

  if (!stats) {
    return <div className="text-gray-400">Loading...</div>;
  }

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = !statusFilter || task.status === statusFilter;
    const riskMatch = !riskFilter || task.slaStatus === riskFilter;
    return statusMatch && riskMatch;
  });

const escalations = tasks
  .filter((t) => t.slaStatus === "OVERDUE")
  .slice(0, 5)
  .map((t) => ({
    id: t._id,
    taskTitle: t.title,
    riskLevel: "OVERDUE" as const,
  }));


  return (
    <div className="space-y-6">

      <TLStatsCards
        totalTasks={stats.totalTasks}
        safeTasks={stats.safe}
        atRiskTasks={stats.atRisk}
        overdueTasks={stats.overdue}
      />

      <div className="grid md:grid-cols-2 gap-6">
<RiskTrendChart data={buildRiskChart(tasks)} />
        <EscalationPanel escalations={escalations} />
        <ActivityFeed />
      </div>

      <TaskFilters
        status={statusFilter}
        risk={riskFilter}
        onStatusChange={setStatusFilter}
        onRiskChange={setRiskFilter}
      />

      <TaskTable tasks={filteredTasks} />
<KanbanBoard tasks={tasks} reload={fetchTasks} />
    </div>
  );
}