import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"

dotenv.config()

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

app.get("/", (_, res) => {
  res.json({ message: "CMS API Running 🚀" })
})

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("✅ MongoDB Connected")
    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000")
    })
  })
  .catch((err) => console.error(err))