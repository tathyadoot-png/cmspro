import express from "express";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket";

import routes from "./routes";
import { seedRolesAndPermissions } from "./seed/seedRolesAndPermissions";
import { seedSuperAdmin } from "./seed/seedSuperAdmin";
import { seedDemoData } from "./seed/seedDemoData";
const app = express();

// 🔐 Middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api", routes);

app.get("/", (_, res) => {
  res.json({ message: "CMS API Running 🚀" });
});

// 🔥 Create HTTP Server
const server = http.createServer(app);

// 🔥 Socket.IO Setup
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Optional: connection log
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// 🔥 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // 🌱 Seed before server starts
    await seedRolesAndPermissions();
    await seedSuperAdmin();
    await seedDemoData();

    server.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });
  })
  .catch((err) => console.error(err));