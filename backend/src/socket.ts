import { Server } from "socket.io";

let io: Server | null = null;

export const initSocket = (server: any) => {

  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true
    }
  });

  io.on("connection", (socket) => {

    console.log("Client connected:", socket.id);

    socket.on("joinTask", (taskId: string) => {
      socket.join(taskId);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

  });

};

/* ✅ SAFE GETTER */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};