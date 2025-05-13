import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./DB/db.js";
import authRoutes from "./routes/User/auth.routes.js";
import reportsRoutes from "./routes/User/reports.routes.js";
import notificationsRoutes from "./routes/User/notifications.routes.js";
import hospitalRoutes from "./routes/Hospital/hospital.routes.js";
import userRoutes from "./routes/User/user.routes.js";
import founderRoutes from "./routes/Founder/founder.routes.js";
import staffRoutes from "./routes/Admin/Staff/staff.routes.js";
import teamRoutes from "./routes/Admin/Team/team.routes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./utils/socket.js";
import status from "express-status-monitor";
import cluster from "node:cluster";
import os from "os";
import { sendNotificationToUser } from "./utils/notifications.js";
import cookieParser from "cookie-parser";

// Define a simple logger
const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message) => console.error(`[ERROR] ${message}`),
  warn: (message) => console.warn(`[WARN] ${message}`),
  debug: (message) => console.debug(`[DEBUG] ${message}`)
};

// Global variables accessible across workers
let io;
let connectedUsers = new Map();
let app;

// Determine number of worker processes based on CPU cores
const totalCPUs = os.cpus().length;
// Limit to max 4 workers to avoid excessive resource usage or you can use all cores
const workerCount = Math.min(totalCPUs, 8);

// Primary process responsible for creating worker processes
if (cluster.isPrimary) {
  console.log(`Medicare API Server - Cluster Mode Enabled`);
  console.log(`Primary process ${process.pid} is running`);
  console.log(
    `Using ${workerCount} workers out of ${totalCPUs} available CPU cores`
  );

  // Create worker processes
  for (let i = 0; i < workerCount; i++) {
    cluster.fork();
  }

  // Handle worker crashes and restart them
  cluster.on("exit", (worker, code, signal) => {
    logger.error(
      `Worker ${worker.process.pid} died (code: ${code}, signal: ${signal})`
    );
    logger.info("Starting a new worker...");
    cluster.fork();
  });
}
// Worker process - runs the actual Express application
else {
  console.log(`Worker ${process.pid} started`);

  // Get directory path for ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Load environment variables with absolute path
  dotenv.config({ path: path.resolve(__dirname, ".env") });

  const port = process.env.PORT || 4000;
  app = express();

  // Middleware
  app.use(status({ path: "/status" }));
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.CLIENT_URL
          : "http://localhost:5173", // Vite's default port
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );
  app.use(express.json());
  app.use(cookieParser()); // Add cookie parser for handling HTTP-only cookies

  // Request logging middleware - simplified to reduce log clutter
  app.use((req, res, next) => {
    // Only log certain requests, exclude status checks, options requests, etc.
    if (req.method !== "OPTIONS" && !req.url.includes("/status")) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
  });

  // Register API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/reports", reportsRoutes);
  app.use("/api/notifications", notificationsRoutes);
  app.use("/api/hospital", hospitalRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/founder", founderRoutes); // Add founder routes
  app.use("/api/staff", staffRoutes); // Add staff routes
  app.use("/api/teams", teamRoutes); // Add team routes

  // Root route
  app.get("/", (req, res) => {
    res.json({
      message: `Hello from Medicare API Server! ${process.pid}`,
    });
    res.send("Medicare API Server is ready");
  });

  // Health check route for WebSocket testing
  app.get("/socket-health", (req, res) => {
    const wsStatus = io
      ? "WebSocket server initialized"
      : "WebSocket server not initialized";
    const connectedClientsCount = io ? io.engine.clientsCount : 0;

    res.json({
      status: "success",
      message: wsStatus,
      socketPath: "/socket.io",
      activeConnections: connectedClientsCount,
      transports: ["polling", "websocket"],
      timestamp: new Date().toISOString(),
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Initialize WebSocket server
  io = new Server(httpServer, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? [process.env.CLIENT_URL]
          : ["http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    path: "/socket.io",
    transports: ["polling", "websocket"],
    allowUpgrades: true,
    pingTimeout: 30000,
    pingInterval: 25000,
    cookie: false,
  });

  // Handle WebSocket connections
  io.on("connection", (socket) => {
    console.log(`WebSocket connection established: ${socket.id}`);

    // User authentication and association with socket
    socket.on("authenticate", (userId) => {
      if (userId) {
        console.log(`User ${userId} authenticated on socket ${socket.id}`);
        connectedUsers.set(userId, socket.id);
      }
    });

    socket.on("disconnect", (reason) => {
      // Remove user from connected users
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User ${userId} disconnected from socket ${socket.id}`);
          break;
        }
      }
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  // Initialize Socket.IO
  initSocket(httpServer);

  // Connect to MongoDB and start server
  connectDB()
    .then(() => {
      httpServer.listen(port, () => {
        console.log(
          `🚀 Server worker ${process.pid} started at http://localhost:${port}`
        );
      });
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    });
}

// Helper function to send notification to a specific user
const sendUserNotification = async (
  userId,
  title,
  message,
  type = "info",
  link = null
) => {
  return await sendNotificationToUser(
    io,
    connectedUsers,
    userId,
    title,
    message,
    type,
    link
  );
};

export default app;
export { io, sendUserNotification };
