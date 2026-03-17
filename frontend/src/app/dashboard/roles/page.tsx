"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function RolesPage() {

  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    const res = await api.get("/roles");
    setRoles(res.data.data);
  };

  const fetchPermissions = async () => {
    const res = await api.get("/permissions");
    setPermissions(res.data.data);
  };

  /* =========================
     TOGGLE PERMISSION
  ========================= */
  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  /* =========================
     CREATE ROLE
  ========================= */
  const handleCreate = async () => {
    await api.post("/roles", {
      name,
      permissions: selectedPermissions,
    });

    resetForm();
    fetchRoles();
  };

  /* =========================
     EDIT ROLE
  ========================= */
  const handleEdit = (role: any) => {
    setName(role.name);
    setEditingId(role._id);

    const permissionIds = role.permissions?.map((p: any) =>
      typeof p === "object" ? p._id : p
    );

    setSelectedPermissions(permissionIds || []);
  };

  /* =========================
     UPDATE ROLE
  ========================= */
  const handleUpdate = async () => {
    await api.put(`/roles/${editingId}`, {
      name,
      permissions: selectedPermissions,
    });

    resetForm();
    fetchRoles();
  };

  /* =========================
     DELETE ROLE
  ========================= */
  const handleDelete = async (id: string) => {
    await api.delete(`/roles/${id}`);
    fetchRoles();
  };

  /* =========================
     RESET FORM
  ========================= */
  const resetForm = () => {
    setName("");
    setSelectedPermissions([]);
    setEditingId(null);
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Roles Management</h1>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          className="border p-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Role name"
        />

        {editingId ? (
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={handleUpdate}
          >
            Update
          </button>
        ) : (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleCreate}
          >
            Add
          </button>
        )}
      </div>

      {/* PERMISSIONS */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-3">
          Select Permissions ({selectedPermissions.length})
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

          {permissions.map((p) => (
            <label
              key={p._id}
              className="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <input
                type="checkbox"
                checked={selectedPermissions.includes(p._id)}
                onChange={() => togglePermission(p._id)}
              />

              <span className="text-sm">{p.name}</span>
            </label>
          ))}

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 mt-3">

          <button
            className="text-sm text-blue-600"
            onClick={() => setSelectedPermissions(permissions.map(p => p._id))}
          >
            Select All
          </button>

          <button
            className="text-sm text-red-600"
            onClick={() => setSelectedPermissions([])}
          >
            Clear
          </button>

        </div>

      </div>

      {/* ROLES LIST */}
      <div className="space-y-2">

        {roles.map((r) => (

          <div
            key={r._id}
            className="border p-3 rounded flex justify-between items-center"
          >

            <div>
              <div className="font-medium">{r.name}</div>

              <div className="text-xs text-gray-500">
                {r.permissions?.map((p: any) => p.name).join(", ")}
              </div>
            </div>

            <div className="flex gap-3">

              <button
                className="text-blue-600 hover:underline"
                onClick={() => handleEdit(r)}
              >
                Edit
              </button>

              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(r._id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}