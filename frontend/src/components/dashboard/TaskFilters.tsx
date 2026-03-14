"use client";

import React from "react";

type Props = {
  status: string;
  risk: string;
  onStatusChange: (value: string) => void;
  onRiskChange: (value: string) => void;
};

export default function TaskFilters({
  status,
  risk,
  onStatusChange,
  onRiskChange,
}: Props) {
  return (
    <div className="flex gap-4 mb-4">

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Status</option>
        <option value="ASSIGNED">ASSIGNED</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="IN_REVIEW">IN_REVIEW</option>
        <option value="COMPLETED">COMPLETED</option>
      </select>

      <select
        value={risk}
        onChange={(e) => onRiskChange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Risk</option>
        <option value="SAFE">SAFE</option>
        <option value="AT_RISK">AT_RISK</option>
        <option value="OVERDUE">OVERDUE</option>
      </select>

    </div>
  );
}