"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateWorkshopPage() {

  const router = useRouter();

  const [clients,setClients] = useState<any[]>([]);

  const [form,setForm] = useState({
    workshopName:"",
    description:"",
    clientId:""
  });

  useEffect(()=>{
    fetchClients();
  },[]);

  const fetchClients = async () =>{
    const res = await api.get("/clients");
    setClients(res.data.data || []);
  }

  const handleSubmit = async(e:any)=>{
    e.preventDefault();

    await api.post("/workshops",form);

    router.push("/dashboard/workshops");
  }

  return (
    <div className="p-6 max-w-xl">

      <h1 className="text-xl font-bold mb-4">
        Create Workshop
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <select
          className="border p-2 w-full"
          value={form.clientId}
          onChange={(e)=>
            setForm({...form,clientId:e.target.value})
          }
        >
          <option value="">Select Client</option>

          {clients.map((c)=>(
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}

        </select>

        <input
          className="border p-2 w-full"
          placeholder="Workshop Name"
          value={form.workshopName}
          onChange={(e)=>
            setForm({...form,workshopName:e.target.value})
          }
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={form.description}
          onChange={(e)=>
            setForm({...form,description:e.target.value})
          }
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Workshop
        </button>

      </form>

    </div>
  );
}