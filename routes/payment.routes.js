import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createOrder, verifyPayment,getMyPayments,getPaymentsBySociety,getPaymentSummary } from "../controllers/payment.controller.js";

const router = express.Router();

// Resident
router.post("/create-order", protect, authorize("resident"), createOrder);
router.post("/verify-payment", protect, authorize("resident"), verifyPayment);
router.get("/my", protect, authorize("resident"), getMyPayments);
// Admin view all payments for a society
router.get(
  "/society/:societyId",
  protect,
  authorize("admin", "superadmin"),
  getPaymentsBySociety
);

// Admin summary
router.get(
  "/summary/:societyId",
  protect,
  authorize("admin", "superadmin"),
  getPaymentSummary
);

export default router;
