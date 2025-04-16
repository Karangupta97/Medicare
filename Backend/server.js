import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./DB/db.js";
import authRoutes from "./routes/auth.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import hospitalRoutes from "./routes/Hospital/hospital.routes.js";
import userRoutes from "./routes/User/user.routes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { createNotification } from "./controllers/notifications.controller.js";
import http from 'http';
import { initSocket } from './utils/socket.js';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with absolute path
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Store connected users
const connectedUsers = new Map();
const port = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? process.env.CLIENT_URL 
    : "http://localhost:5173", // Vite's default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

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
app.use("/api/notifications", notificationsRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/user", userRoutes);

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

// Add health check route for WebSocket testing
app.get("/socket-health", (req, res) => {
  const wsStatus = io ? "WebSocket server initialized" : "WebSocket server not initialized";
  const connectedClientsCount = io ? io.engine.clientsCount : 0;
  
  res.json({
    status: "success",
    message: wsStatus,
    socketPath: "/socket.io",
    activeConnections: connectedClientsCount,
    transports: ['polling', 'websocket'],
    timestamp: new Date().toISOString()
  });
});

// Create an HTTP server
const httpServer = createServer(app);

// Initialize WebSocket server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === "production" 
      ? [process.env.CLIENT_URL]  // Add all production domains
      : ["http://localhost:5173"], // Add all possible local development URLs
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  path: '/socket.io',
  transports: ['polling', 'websocket'], // Start with polling then upgrade to websocket
  allowUpgrades: true,
  pingTimeout: 30000,
  pingInterval: 25000,
  cookie: false
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("WebSocket connection established:", socket.id);
  
  // User authentication and association with socket
  socket.on('authenticate', (userId) => {
    if (userId) {
      console.log(`User ${userId} authenticated on socket ${socket.id}`);
      connectedUsers.set(userId, socket.id);
      
      // No longer sending test notification on connection
      // This prevents the "Connection Established" message from showing
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    // Remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} removed from connected users`);
        break;
      }
    }
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Helper function to send notification to a specific user
export const sendNotificationToUser = async (userId, title, message, type = 'info', link = null) => {
  try {
    // Create notification in database
    const notification = await createNotification(userId, title, message, type, link);
    
    // Send notification via WebSocket if user is connected
    const socketId = connectedUsers.get(userId.toString());
    if (socketId) {
      io.to(socketId).emit('notification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        createdAt: notification.createdAt
      });
      console.log(`Real-time notification sent to user ${userId}`);
    } else {
      console.log(`User ${userId} not connected, notification saved to database only`);
    }
    
    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
};

// Create HTTP server from your app
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`🚀 Server started at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export default app;
export { io };