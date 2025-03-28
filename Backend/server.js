import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./DB/db.js";
import authRoutes from "./Routes/auth.routes.js";

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true  }));
 
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

// Middleware to log request body
app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  next();
});

connectDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});

export default app;