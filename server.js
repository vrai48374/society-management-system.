  import "dotenv/config.js";
  import express from "express";
  import helmet from "helmet";
  import cors from "cors";
  import compression from "compression";
  import morgan from "morgan";
  import cookieParser from "cookie-parser";

  import { apiLimiter } from "./middleware/rateLimiter.js";
  import { errorHandler } from "./middleware/errorHandler.js";
  import { connectDB } from "./config/db.js";

  // Routes
  import healthRoutes from "./routes/health.routes.js";
  import authRoutes from "./routes/authRoutes.js";
  import profileRoutes from "./routes/profileRoutes.js";
  import userRoutes from "./routes/user.routes.js";
  import societyRoutes from "./routes/society.routes.js";
  import blockRoutes from "./routes/block.routes.js";
  import flatRoutes from "./routes/flat.routes.js";
  import ticketRoutes from "./routes/ticket.routes.js";
  import issueRoutes from "./routes/issue.routes.js"; // issues
  import adminRoutes from "./routes/admin.routes.js";
  import { ensureSuperAdmin } from "./utils/bootstrapAdmin.js";
  import superadminRoutes from "./routes/superadminRoutes.js";
  import noticeroutes from "./routes/notice.routes.js";

  const app = express();
  app.set("trust proxy", 1);
  // 🔹 Security & Performance Middlewares
  app.use(helmet());
  app.use(cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "https://vrai48374.github.io",
      "https://vrai48374.github.io/society-frontend",
      "https://cute-medovik-4edd9e.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }));





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
  app.use("/api/blocks", blockRoutes);        // blocks
  app.use("/api/flats", flatRoutes);          // flats
  app.use("/api/tickets", ticketRoutes);      // tickets
  app.use("/api/issues", issueRoutes);        // issues

  app.use("/api", superadminRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/notice",noticeroutes);
  // 🔹 404 handler
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: `Route not found: ${req.originalUrl}`,
    });
  });

  //Error handler
  app.use(errorHandler);

  //  Start server
  const PORT = process.env.PORT || 5000;

  async function startServer() {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(` Server running: http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error(" Failed to start server:", error.message);
      process.exit(1);
    }
  }

  startServer();
