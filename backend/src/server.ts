// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();

// import mongoose from "mongoose";
// import cors from "cors";
// import helmet from "helmet";
// import cookieParser from "cookie-parser";
// import http from "http";

// import { initSocket } from "./socket";

// import routes from "./routes";
// import { seedRolesAndPermissions } from "./seed/seedRolesAndPermissions";
// import { seedSuperAdmin } from "./seed/seedSuperAdmin";
// import { seedDemoData } from "./seed/seedDemoData";

// const app = express();

// /* 🔐 Middlewares */

// app.use(helmet());

// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

// /* 📡 Routes */

// app.use("/api", routes);

// app.get("/", (_, res) => {
//   res.json({ message: "CMS API Running 🚀" });
// });

// /* 🔥 Create HTTP Server */

// const server = http.createServer(app);

// /* 🔥 Initialize Socket */

// initSocket(server);

// /* 🔥 MongoDB Connection */

// mongoose
//   .connect(process.env.MONGO_URI as string)
//   .then(async () => {

//     console.log("✅ MongoDB Connected");

//     /* 🌱 Seed Data */

//     await seedRolesAndPermissions();

//     await seedSuperAdmin();

//     await seedDemoData();

//     server.listen(5000, () => {

//       console.log("🚀 Server running on http://localhost:5000");

//     });

//   })
//   .catch((err) => console.error(err));









import express from "express";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import http from "http";

import { initSocket } from "./socket";
import routes from "./routes";

import { seedRolesAndPermissions } from "./seed/seedRolesAndPermissions";
import { seedSuperAdmin } from "./seed/seedSuperAdmin";
import { seedDemoData } from "./seed/seedDemoData";
import "../src/models/notification/notification.listener";

const app = express();

/* 🔐 SECURITY MIDDLEWARES */

app.use(helmet());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

/* 🌍 CORS CONFIG (LOCAL + PRODUCTION) */

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests like postman / mobile apps
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* 📡 ROUTES */

app.use("/api", routes);

app.get("/", (_, res) => {
  res.json({ message: "CMS API Running 🚀" });
});

/* 🔥 CREATE SERVER */

const server = http.createServer(app);

/* 🔌 SOCKET INIT */

initSocket(server);

/* 🛢️ DATABASE CONNECTION */

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    /* 🌱 SEED DATA (run once safely) */

    await seedRolesAndPermissions();
    await seedSuperAdmin();
    await seedDemoData();

    /* 🚀 START SERVER */

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });