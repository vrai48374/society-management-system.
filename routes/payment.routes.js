import express from "express";
import { createPayment, getMyPayments, getSocietyPayments } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js"; // auth middleware

const router = express.Router();

// Resident routes
router.post("/", protect, createPayment);
router.get("/me", protect, getMyPayments);

// Admin routes
router.get("/society/:societyId", protect, getSocietyPayments);

export default router;
