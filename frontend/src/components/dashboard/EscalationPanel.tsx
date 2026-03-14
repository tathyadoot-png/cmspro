"use client";

import React from "react";

type Escalation = {
  id: string;
  taskTitle: string;
  riskLevel: "HIGH" | "OVERDUE";
};

type Props = {
  escalations: Escalation[];
};

export default function EscalationPanel({ escalations }: Props) {
  return (
    <div className="bg-white shadow rounded-xl p-5 border">
      <h2 className="text-lg font-semibold mb-4">Escalations</h2>

      {escalations.length === 0 && (
        <p className="text-sm text-gray-500">No escalations</p>
      )}

      <div className="space-y-3">
        {escalations.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border rounded-lg p-3"
          >
            <div>
              <p className="font-medium">{item.taskTitle}</p>
              <p className="text-sm text-gray-500">Task Issue</p>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full ${
                item.riskLevel === "OVERDUE"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {item.riskLevel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}