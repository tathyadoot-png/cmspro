"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function UsersPage() {

  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {

    const res = await api.get("/users");

    setUsers(res.data.data);

  };

  const fetchRoles = async () => {

    const res = await api.get("/roles");

    setRoles(res.data.data);

  };

  const toggleRole = (roleId: string) => {

    if (selectedRoles.includes(roleId)) {

      setSelectedRoles(
        selectedRoles.filter(r => r !== roleId)
      );

    } else {

      setSelectedRoles([
        ...selectedRoles,
        roleId
      ]);

    }

  };

  const resetForm = () => {

    setName("");
    setEmail("");
    setPassword("");
    setSelectedRoles([]);
    setEditingId(null);

  };

  const handleCreate = async () => {

    await api.post("/users", {
      name,
      email,
      password,
      roles: selectedRoles
    });

    resetForm();
    fetchUsers();

  };

  const handleEdit = (user: any) => {

    setEditingId(user._id);

    setName(user.name);
    setEmail(user.email);

    const roleIds = user.roles.map(
      (r: any) => r._id
    );

    setSelectedRoles(roleIds);

  };

  const handleUpdate = async () => {

    if (!editingId) return;

    await api.put(`/users/${editingId}`, {
      name,
      email,
      roles: selectedRoles
    });

    resetForm();
    fetchUsers();

  };

  const handleDelete = async (id: string) => {

    await api.delete(`/users/${id}`);

    fetchUsers();

  };

  return (

    <div className="space-y-6">

      <h1 className="text-xl font-semibold">
        Users
      </h1>

      {/* USER FORM */}

      <div className="border p-4 rounded space-y-3">

        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        {!editingId && (

          <input
            className="border p-2 w-full"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

        )}

        {/* Roles */}

        <div>

          <p className="font-medium">
            Roles
          </p>

          <div className="flex gap-3 flex-wrap">

            {roles.map((r)=>(
              <label
                key={r._id}
                className="flex gap-1 items-center"
              >

                <input
                  type="checkbox"
                  checked={
                    selectedRoles.includes(r._id)
                  }
                  onChange={()=>toggleRole(r._id)}
                />

                {r.name}

              </label>
            ))}

          </div>

        </div>

        {editingId ? (

          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleUpdate}
          >
            Update User
          </button>

        ) : (

          <button
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={handleCreate}
          >
            Create User
          </button>

        )}

      </div>

      {/* USERS TABLE */}

      <table className="w-full text-sm border">

        <thead>

          <tr className="border-b">

            <th className="p-2 text-left">
              Code
            </th>

            <th className="p-2 text-left">
              Name
            </th>

            <th className="p-2 text-left">
              Email
            </th>

            <th className="p-2 text-left">
              Roles
            </th>

            <th className="p-2 text-left">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {users.map((u)=>(
            <tr key={u._id} className="border-b">

              <td className="p-2">
                {u.userCode}
              </td>

              <td className="p-2">
                {u.name}
              </td>

              <td className="p-2">
                {u.email}
              </td>

              <td className="p-2">
                {u.roles
                  ?.map((r:any)=>r.name)
                  .join(", ")}
              </td>

              <td className="p-2 flex gap-3">

                <button
                  className="text-blue-600"
                  onClick={()=>handleEdit(u)}
                >
                  Edit
                </button>

                <button
                  className="text-red-600"
                  onClick={()=>handleDelete(u._id)}
                >
                  Delete
                </button>

                {/* 🔥 USER ACTIVITY PAGE */}

                <Link
                  href={`/dashboard/users/${u._id}`}
                  className="text-purple-600"
                >
                  Activity
                </Link>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );

}