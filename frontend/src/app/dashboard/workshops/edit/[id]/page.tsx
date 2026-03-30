"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function EditWorkshopPage() {
  const { id } = useParams();
  const router = useRouter();

  const [workshopName, setWorkshopName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkshop();
  }, []);

  const fetchWorkshop = async () => {
    try {
      const res = await api.get(`/workshops/${id}`);
      const data = res.data.data;

      setWorkshopName(data.workshopName || "");
      setDescription(data.description || "");
      setPriority(data.priority || "MEDIUM");

      if (data.deadline) {
        setDeadline(data.deadline.split("T")[0]); // date input fix
      }

    } catch (err) {
      console.error(err);
    }
  };

  const updateWorkshop = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.patch(`/workshops/${id}`, {
        workshopName,
        description,
        priority,
        deadline,
      });

      router.push("/dashboard/workshops");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Workshop</h1>

      <form onSubmit={updateWorkshop} className="space-y-5">

        {/* Workshop Name */}
        <div>
          <label className="text-sm font-semibold">Workshop Name</label>
          <input
            value={workshopName}
            onChange={(e) => setWorkshopName(e.target.value)}
            className="w-full border p-3 rounded-lg mt-1"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded-lg mt-1"
          />
        </div>

        {/* Priority */}
    
      

        {/* Button */}
        <button
          disabled={loading}
          className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Updating..." : "Update Workshop"}
        </button>

      </form>
    </div>
  );
}