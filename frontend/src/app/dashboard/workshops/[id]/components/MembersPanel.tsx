"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function MembersPanel({ workshopId, workshop }: any) {

  const [members, setMembers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (workshopId) {
      fetchMembers();
      fetchUsers();
    }
  }, [workshopId]);

  const fetchMembers = async () => {

    const res = await api.get(`/workshops/${workshopId}`);

    setMembers(res.data.data.members || []);

  };

  const fetchUsers = async () => {

    const res = await api.get("/users");

    setUsers(res.data.data || []);

  };

  const addMember = async () => {

    if (!selected) return;

    await api.post(`/workshops/${workshopId}/members`, {
      members: [selected]
    });

    setSelected("");

    fetchMembers();

  };

  /* 🔥 MAKE TL */

  const makeTL = async (userId:string) => {

    await api.post(`/workshops/${workshopId}/teamlead`,{
      userId
    });

    fetchMembers();

  };

  /* 🔥 REMOVE TL */

  const removeTL = async (userId:string) => {

    await api.post(`/workshops/${workshopId}/remove-teamlead`,{
      userId
    });

    fetchMembers();

  };

  return (

    <div className="border p-4 rounded-lg space-y-4">

      <h2 className="font-semibold text-lg">
        Members
      </h2>

      {/* Members List */}

      <div className="space-y-2">

        {members.length === 0 && (
          <p className="text-sm text-gray-500">
            No members yet
          </p>
        )}

        {members.map((m: any) => {

          let role = "Member";

          const isTL =
            workshop?.teamLeads?.some((u:any)=>u._id === m._id);

          const isWriter =
            workshop?.writers?.some((u:any)=>u._id === m._id);

          const isEditor =
            workshop?.editors?.some((u:any)=>u._id === m._id);

          if (isTL) role = "TL";
          else if (isWriter) role = "Writer";
          else if (isEditor) role = "Editor";

          return (

            <div
              key={m._id}
              className="border rounded-lg p-3 flex justify-between items-center"
            >

              <div>

                <p className="font-semibold">
                  {m.name}
                </p>

                <p className="text-xs text-gray-500">
                  {m.userCode}
                </p>

              </div>

              <div className="flex items-center gap-3">

                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {role}
                </span>

                {!isTL && (
                  <button
                    onClick={()=>makeTL(m._id)}
                    className="text-xs text-blue-600"
                  >
                    Make TL
                  </button>
                )}

                {isTL && (
                  <button
                    onClick={()=>removeTL(m._id)}
                    className="text-xs text-red-600"
                  >
                    Remove TL
                  </button>
                )}

              </div>

            </div>

          );

        })}

      </div>

      {/* Add Member UI */}

      <div className="flex gap-2">

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border p-2 rounded"
        >

          <option value="">
            Select user
          </option>

          {users.map((u: any) => (

            <option key={u._id} value={u._id}>
              {u.name}
            </option>

          ))}

        </select>

        <button
          onClick={addMember}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >

          Add

        </button>

      </div>

    </div>

  );

}