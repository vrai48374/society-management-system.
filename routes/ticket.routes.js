// routes/ticket.routes.js
import express from "express";
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
} from "../controllers/ticket.controller.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Resident → create ticket
router.post("/", protect, authorize("resident"), createTicket);

// Resident → view own tickets
router.get("/my", protect, authorize("resident"), getMyTickets);

// Admin → view all tickets
router.get("/", protect, authorize("admin", "superadmin"), getAllTickets);

// Admin/Resident → update ticket status (resolved/closed)
router.put("/:id/status", protect, authorize("admin", "resident"), updateTicketStatus);

export default router;
