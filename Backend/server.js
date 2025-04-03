import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./DB/db.js";
import authRoutes from "./routes/auth.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();

// Middleware
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors({ origin: "https://www.medicares.in", credentials: true  }));
app.use(express.json());
app.use(cookieParser());

// Middleware to log request body
app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server started at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export default app;