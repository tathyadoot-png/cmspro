"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function MembersPanel({ workshopId }: any) {

  const [members, setMembers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetchMembers();
    fetchUsers();
  }, []);

  const fetchMembers = async () => {
    const res = await api.get(`/workshops/${workshopId}`);
    setMembers(res.data.data.members || []);
  };

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data.data || []);
  };

  const addMember = async () => {

    await api.post(`/workshops/${workshopId}/members`, {
      members: [selected]
    });

    fetchMembers();
  };

  return (
    <div className="border p-3 rounded">

      <h2 className="font-semibold mb-2">
        Members
      </h2>

      <div className="flex gap-2 flex-wrap">

        {members.map((m: any) => (
          <span
            key={m._id}
            className="px-2 py-1 bg-gray-200 rounded text-sm"
          >
            {m.name}
          </span>
        ))}

      </div>

      <div className="flex gap-2 mt-3">

        <select
          onChange={(e) => setSelected(e.target.value)}
          className="border p-1"
        >
          <option>Select user</option>

          {users.map((u: any) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}

        </select>

        <button
          onClick={addMember}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add
        </button>

      </div>

    </div>
  );
}