"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";

export default function TaskComments({ taskId }: any) {

  const [comments,setComments] = useState<any[]>([]);
  const [message,setMessage] = useState("");

  useEffect(()=>{

    fetchComments();

    socket.emit("joinTask",taskId);

    socket.on("NEW_COMMENT",(comment)=>{

      if(comment.taskId === taskId){
        setComments(prev => [comment,...prev]);
      }

    });

    return ()=>{
      socket.off("NEW_COMMENT");
    };

  },[taskId]);

  const fetchComments = async () => {

    const res = await api.get(`/task-comments/${taskId}`);

    setComments(res.data.data);

  };

  const sendComment = async () => {

    if(!message) return;

    await api.post("/task-comments",{
      taskId,
      message
    });

    setMessage("");

  };

  return (

    <div className="space-y-4">

      <h2 className="font-semibold">
        Comments
      </h2>

      <div className="space-y-3">

        {comments.map((c:any)=> (

          <div
            key={c._id}
            className="border rounded p-3"
          >

            <div className="text-sm font-semibold">
              {c.userId?.name}
            </div>

            <div className="text-sm">
              {c.message}
            </div>

          </div>

        ))}

      </div>

      <div className="flex gap-2">

        <input
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          placeholder="Write comment..."
          className="border p-2 flex-1"
        />

        <button
          onClick={sendComment}
          className="bg-black text-white px-4"
        >
          Send
        </button>

      </div>

    </div>

  );

}