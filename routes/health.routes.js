import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  try {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
      env: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Health check failed" });
  }
});

export default router;
// A health route (or health check endpoint) is a special API endpoint (like /api/health) used to confirm if your server and app are running correctly.

// It usually returns a small JSON with status information.

// 🔹 Why do we use it?

// Server monitoring

// Tells you if your backend is alive and responding.

// Example: if server crashes → health route won’t respond.

// Load balancer / Cloud services requirement

// AWS, Azure, GCP, Docker, Kubernetes → all need health checks to decide if an instance is “healthy” or should be restarted.

// Debugging

// When testing locally, it’s a quick way to confirm your server is up.

// No need to check DB or routes manually.

// 🔹 What functionality it adds to your project?

// Adds a heartbeat API.

// Returns details like:

// status → "ok" (means server is alive)

// uptime → how long server has been running

// timestamp → current server time

// env → current environment (development/production)

// Example response:

// {
//   "status": "ok",
//   "uptime": 1543.23,
//   "timestamp": 1725038765432,
//   "env": "development"
// }


// This is super useful for monitoring dashboards.