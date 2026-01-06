// routes/feeRoutes.js
import express from "express";
import {
  createFee,
  getFees,
  updateFee,
  deleteFee
} from "../controllers/feeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "superadmin"), createFee);
router.get("/", protect, getFees);
router.put("/:feeId", protect, authorize("admin", "superadmin"), updateFee);
router.delete("/:feeId", protect, authorize("admin", "superadmin"), deleteFee);

export default router;