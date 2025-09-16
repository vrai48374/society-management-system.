// routes/paymentRoutes.js
import express from "express";
import {
  recordPayment,
  getPayments,
  getPaymentById,
  getUserPayments,
  updatePaymentStatus
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "superadmin"), recordPayment);
router.get("/", protect, getPayments);
router.get("/user", protect, getUserPayments);
router.get("/:paymentId", protect, getPaymentById);
router.patch("/:paymentId/status", protect, authorize("admin", "superadmin"), updatePaymentStatus);

export default router;