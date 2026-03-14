"use client";

interface Props {
  data: {
    safe: number;
    atRisk: number;
    overdue: number;
  };
}

export default function SLACard({ data }: Props) {
  if (!data) return null;

  return (
    <div className="bg-card p-6 rounded-xl shadow">

      <h2 className="font-semibold mb-4">
        SLA Health
      </h2>

      <div className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span>Safe Tasks</span>
          <span className="text-green-500 font-semibold">
            {data.safe}
          </span>
        </div>

        <div className="flex justify-between">
          <span>At Risk</span>
          <span className="text-yellow-500 font-semibold">
            {data.atRisk}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Overdue</span>
          <span className="text-red-500 font-semibold">
            {data.overdue}
          </span>
        </div>

      </div>

    </div>
  );
}