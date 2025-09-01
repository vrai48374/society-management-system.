import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins window
  max: 300,                 // 300 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});
