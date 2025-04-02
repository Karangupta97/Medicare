import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./DB/db.js";
import authRoutes from "./routes/auth.routes.js";
import reportsRoutes from "./routes/reports.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 4000;
const app = express();

app.use(cors({ origin: "https://www.medicares.in", credentials: true  }));
// app.use(cors({ origin: "http://localhost:5173", credentials: true  }));
 
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.urlencoded({ extended: true }));

// Middleware to log request body
app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  next();
});

// Log requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Static file serving for production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../Frontend/build')));

  // For any request that doesn't match an API route, send the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/build/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});

export default app;