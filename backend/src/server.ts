import express from "express"
import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import routes from "./routes";
import { seedRolesAndPermissions } from "./seed/seedRolesAndPermissions";
import { seedSuperAdmin } from "./seed/seedSuperAdmin";

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)
app.use("/api", routes);

app.get("/", (_, res) => {
  res.json({ message: "CMS API Running 🚀" })
})

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // 🌱 Seed before server starts
    await seedRolesAndPermissions();
 await seedSuperAdmin();
    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });
  })
  .catch((err) => console.error(err));