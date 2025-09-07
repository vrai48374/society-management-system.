import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validateMiddleware.js";
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

//  Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

// Logout (no validation needed)
router.post("/logout", logout);

export default router;
