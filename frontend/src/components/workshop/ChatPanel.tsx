"use client";

import { useEffect,useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ChatPanel({workshopId}:any){

const [messages,setMessages] = useState<any[]>([]);
const [text,setText] = useState("");

useEffect(()=>{

socket.emit("join-workshop",workshopId);

socket.on("new-message",(msg)=>{
setMessages(prev=>[...prev,msg]);
});

},[]);

const sendMessage = ()=>{

socket.emit("send-message",{
workshopId,
message:text
});

setText("");

};

return(

<div className="flex flex-col h-full">

<div className="flex-1 overflow-y-auto p-4">

{messages.map((m,i)=>(
<div key={i} className="mb-2">
{m.message}
</div>
))}

</div>

<div className="border-t p-2 flex">

<input
className="flex-1 border p-2"
value={text}
onChange={(e)=>setText(e.target.value)}
/>

<button
onClick={sendMessage}
className="ml-2 bg-blue-600 text-white px-3"
>
Send
</button>

</div>

</div>

);

}