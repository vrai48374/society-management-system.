import "dotenv/config.js";
import express from "express";

import helmet from "helmet";//for security purpose we use
import cors from "cors";// allow frontend to talk with backend CORS lets you configure which domains are allowed. By default, browsers block API calls if frontend origin ≠ backend origin.
import compression from "compression";//By default, browsers block API calls if frontend origin ≠ backend origin.Makes payload smaller → faster load → saves bandwidth. API sends JSON: 100 KB uncompressed.With compression: ~20 KB.
import morgan from "morgan";//Logs each HTTP request in the console.Shows method, URL, status, response time.When something fails (like login), you’ll see exactly what request was made and how server responded Super helpful for debugging.In production, can log to files or monitoring tools.
import cookieParser from "cookie-parser"; 

import { apiLimiter } from "./middleware/rateLimiter.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js"; // new protected routes
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/user.routes.js";

import societyRoutes from "./routes/society.routes.js";


import blockRoutes from "./routes/block.routes.js";
import flatRoutes from "./routes/flat.routes.js";

const app = express();

// Existing routes

// New routes


app.use("/api/blocks", blockRoutes);
app.use("/api/flats", flatRoutes);


// 🔹 Global Middlewares
app.use(helmet());                      // security headers
app.use(cors());                        // cross-origin allowed
app.use(compression());                 // gzip responses
app.use(express.json({ limit: "10mb" })); // parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));                 // request logs
app.use(cookieParser()); // 👈 Needed to read cookies

// 🔹 Static files (images, pdfs later)
app.use("/public", express.static("public"));

// 🔹 Rate limiting for APIs
app.use("/api", apiLimiter);

// 🔹 User CRUD
app.use("/api/users", userRoutes);

// 🔹 Routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);      // register/login
app.use("/api", profileRoutes);        // protected routes


// society
app.use("/api/users", userRoutes);
app.use("/api/societies", societyRoutes);

app.use("/api/blocks", blockRoutes);
app.use("/api/flats", flatRoutes);

// 🔹 404 & Error Handler
app.use(notFound);
app.use(errorHandler);


// 🔹 Start Server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB(); // connect to DB first
    app.listen(PORT, () => {
      console.log(`Server running: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}




startServer();
