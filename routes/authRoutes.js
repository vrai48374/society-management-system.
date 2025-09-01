import express from "express";
import { register, login, logoutUser } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);
// POST /api/auth/logout
router.post("/logout", logoutUser);

export default router;
