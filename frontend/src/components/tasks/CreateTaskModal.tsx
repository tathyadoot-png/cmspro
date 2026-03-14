"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTaskModal({
  open,
  onClose,
  onCreated,
}: Props) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);

  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    const c = await api.get("/clients");
    const p = await api.get("/projects");
    const u = await api.get("/users");

    setClients(c.data.data);
    setProjects(p.data.data);
    setUsers(u.data.data);
  };

  const handleSubmit = async () => {
    await api.post("/tasks", {
      title,
      description,
      clientId,
      projectId,
      assignedTo,
      priority,
      estimatedMinutes,
    });

    onCreated();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-lg w-[450px] space-y-3">

        <h2 className="text-lg font-semibold">
          Create Task
        </h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">Select Client</option>

          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="w-full border p-2 rounded"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">Select Project</option>

          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        <select
          className="w-full border p-2 rounded"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign User</option>

          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          className="w-full border p-2 rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>

        <input
          type="number"
          className="w-full border p-2 rounded"
          value={estimatedMinutes}
          onChange={(e) =>
            setEstimatedMinutes(Number(e.target.value))
          }
        />

        <div className="flex justify-end gap-2">

          <button
            className="border px-3 py-1 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={handleSubmit}
          >
            Create
          </button>

        </div>

      </div>

    </div>
  );
}