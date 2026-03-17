"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function CreateTaskPanel({ workshop }: any) {

    const [form, setForm] = useState({

        title: "",
        description: "",
        assignedTo: "",
        estimatedMinutes: 30,
        priority: "MEDIUM",
        referenceLink: ""

    });

    const [images, setImages] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

const uploadImage = async(file:any)=>{

const reader = new FileReader();

reader.readAsDataURL(file);

reader.onloadend = async()=>{

try{

const res = await api.post("/upload",{
file:reader.result
});

setImages(prev=>[...prev,res.data.url]);

}catch(err){

console.error(err);
alert("Image upload failed");

}

};

};
    const createTask = async (e: any) => {

        e.preventDefault();

        await api.post("/tasks", {

            ...form,
            workshopId: workshop._id,
            clientId: workshop.clientId._id,
            taskImages: images

        });

        alert("Task created");

    };

    return (

        <div className="border p-4 rounded space-y-4">

            <h2 className="font-semibold text-lg">
                Create Task
            </h2>

            <form
                onSubmit={createTask}
                className="space-y-3"
            >

                <input
                    className="border p-2 w-full"
                    placeholder="Task title"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                />

                <textarea
                    className="border p-2 w-full"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                {/* Assign Member */}

                <select
                    className="border p-2 w-full"
                    value={form.assignedTo}
                    onChange={(e) =>
                        setForm({ ...form, assignedTo: e.target.value })
                    }
                >

                    <option value="">Assign Member</option>

                    {workshop?.members?.map((m: any) => (
                        <option key={m._id} value={m._id}>
                            {m.name}
                        </option>
                    ))}

                </select>

                {/* Estimated Time */}

                <input
                    type="number"
                    className="border p-2 w-full"
                    placeholder="Estimated Minutes"
                    value={form.estimatedMinutes}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            estimatedMinutes: Number(e.target.value)
                        })
                    }
                />

                {/* Priority */}

                <select
                    className="border p-2 w-full"
                    value={form.priority}
                    onChange={(e) =>
                        setForm({ ...form, priority: e.target.value })
                    }
                >

                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>

                </select>

                {/* Video / Reference Link */}

                <input
                    className="border p-2 w-full"
                    placeholder="Video / Reference Link"
                    value={form.referenceLink}
                    onChange={(e) =>
                        setForm({ ...form, referenceLink: e.target.value })
                    }
                />

                {/* Image Upload */}

                <input
                    type="file"
                    multiple
                    onChange={(e) => {

                        const files = e.target.files;

                        if (!files) return;

                        for (let i = 0; i < files.length; i++) {

                            uploadImage(files[i]);

                        }

                    }}
                />

                {uploading && <p>Uploading image...</p>}

                {/* Preview */}

                <div className="flex gap-2 flex-wrap">

                    {images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            className="w-20 h-20 object-cover rounded"
                        />
                    ))}

                </div>

                <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >

                    Create Task

                </button>

            </form>

        </div>

    );

}