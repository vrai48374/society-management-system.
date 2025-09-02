import "dotenv/config.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { apiLimiter } from "./middleware/rateLimiter.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";

// Routes
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import userRoutes from "./routes/user.routes.js";
import societyRoutes from "./routes/society.routes.js";
import blockRoutes from "./routes/block.routes.js";
import flatRoutes from "./routes/flat.routes.js";

const app = express();

// 🔹 Global Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// 🔹 Static files
app.use("/public", express.static("public"));

// 🔹 Rate limiting
app.use("/api", apiLimiter);

// 🔹 Public routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);

// 🔹 Protected routes
app.use("/api", profileRoutes);             // profile info
app.use("/api/users", userRoutes);          // users
app.use("/api/societies", societyRoutes);   // societies
app.use("/api/blocks", blockRoutes);        // ✅ blocks
app.use("/api/flats", flatRoutes);          // ✅ flats

// 🔹 404 & error handler
app.use(notFound);
app.use(errorHandler);

// 🔹 Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
