import { Server } from "socket.io";

let io: Server | null = null;

export const initSocket = (server: any) => {

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_PROD,
  ];

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // allow Postman / server-to-server requests
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          console.log("❌ Socket CORS blocked:", origin);
          return callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    console.log("🔌 Client connected:", socket.id);

    socket.on("joinTask", (taskId: string) => {
      socket.join(taskId);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
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

/* ✅ ESCALATION EMITTER */
export const emitEscalation = (data: any) => {
  if (!io) {
    console.log("⚠️ Socket not initialized");
    return;
  }

  io.emit("escalation", data);
};