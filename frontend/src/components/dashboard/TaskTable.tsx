"use client";

import { api } from "@/lib/api";
import Link from "next/dist/client/link";

type Task = {
  _id: string;
  title: string;
  status: string;
  slaStatus: "SAFE" | "AT_RISK" | "OVERDUE";
  assignedTo?: {
    name: string;
  };
  createdAt?: string;
};

type Props = {
  tasks: Task[];
};

export default function TaskTable({ tasks }: Props) {

  const approveTask = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}/approve`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const requestRevision = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}/revision`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-5 border mt-6">

      <h2 className="text-lg font-semibold mb-4">
        Team Tasks
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Task</th>
              <th className="py-2">Assignee</th>
              <th className="py-2">Status</th>
              <th className="py-2">Risk</th>
              <th className="py-2">Created</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (

              <tr key={task._id} className="border-b">

                <td className="py-2">
                  {task.title}
                </td>

                <td className="py-2">
                  {task.assignedTo?.name || "Unassigned"}
                </td>

                <td className="py-2">
                  {task.status}
                </td>

                <td className="py-2">

                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      task.slaStatus === "OVERDUE"
                        ? "bg-red-100 text-red-600"
                        : task.slaStatus === "AT_RISK"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {task.slaStatus}
                  </span>

                </td>

                <td className="py-2">
                  {task.createdAt
                    ? new Date(task.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                {/* <td>
<Link href={`/dashboard/tasks/${task._id}`}>
{task.title}
</Link>
</td> */}

                <td className="py-2 flex gap-2">

                  <button
                    onClick={() => approveTask(task._id)}
                    className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => requestRevision(task._id)}
                    className="px-2 py-1 text-xs bg-yellow-500 text-white rounded"
                  >
                    Revision
                  </button>

                </td>

              </tr>

            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}