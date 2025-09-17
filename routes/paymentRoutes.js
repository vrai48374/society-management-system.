// routes/paymentRoutes.js
import express from "express";
import {
  recordPayment,
  getPayments,
  getPaymentById,
  getUserPayments,
  updatePaymentStatus,
  getMyPayments,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "superadmin"), recordPayment);
router.get("/", protect, getPayments);
router.get("/user", protect, getUserPayments);
router.get("/:paymentId", protect, getPaymentById);
router.patch("/:paymentId/status", protect, authorize("admin", "superadmin"), updatePaymentStatus);
router.post("/record", protect, recordPayment);
router.get("/my-payments", protect, getMyPayments);
export default router;