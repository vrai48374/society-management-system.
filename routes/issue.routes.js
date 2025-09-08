// routes/issue.routes.js
import express from "express";
import {
  createIssue,
  getAllIssues,
  getMyIssues,
  updateIssueStatus,
  resolveIssue,
  closeIssue,
} from "../controllers/issue.controller.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { clearOldIssues } from "../controllers/issue.controller.js";
const router = express.Router();

// Resident: Raise an issue
router.post("/", protect, authorize("resident", "admin", "superadmin"), createIssue);

// Resident: View my issues
router.get("/me", protect, authorize("resident"), getMyIssues);

// Admin/Superadmin: View all issues
router.get("/", protect, authorize("admin", "superadmin"), getAllIssues);

// Admin/Superadmin: Update issue status
router.put("/:id/status", protect, authorize("admin", "superadmin"), updateIssueStatus);

// Admin/Superadmin: Mark as resolved
router.put("/:id/resolve", protect, authorize("admin", "superadmin"), resolveIssue);

// Resident (who raised) OR Admin/Superadmin: Close issue
router.put("/:id/close", protect, authorize("resident", "admin", "superadmin"), closeIssue);
router.delete("/clear-old", clearOldIssues);

export default router;
