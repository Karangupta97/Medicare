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
app.use(cors({ origin: "https://medicare-backend-pdci8.ondigitalocean.app", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Middleware to log request details
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes);

// Log available routes
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(`Route: ${Object.keys(r.route.methods)} ${r.route.path}`);
  } else if (r.name === 'router') {
    r.handle.stack.forEach(function(h) {
      if (h.route) {
        console.log(`Route: ${Object.keys(h.route.methods)} ${r.regexp} ${h.route.path}`);
      }
    });
  }
});

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