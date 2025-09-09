// controllers/paymentController.js
import Payment from "../models/Payment.js";
import Flat from "../models/Flat.js";
import Society from "../models/Society.js";

// Create a new payment
export const createPayment = async (req, res, next) => {
  try {
    const { flatId, amount, month, paymentMode, transactionId } = req.body;
    const userId = req.user.id; // from auth middleware

    // Ensure flat exists
    const flat = await Flat.findById(flatId).populate("block");
    if (!flat) return res.status(404).json({ success: false, message: "Flat not found" });

    const societyId = flat.block?.society;
    if (!societyId) return res.status(400).json({ success: false, message: "Society not linked" });

    const payment = await Payment.create({
      user: userId,
      flat: flatId,
      society: societyId,
      amount,
      month,
      paymentMode,
      transactionId,
      status: "paid", // assume manual confirmation
    });

    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

// Get all my payments
export const getMyPayments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.find({ user: userId })
      .populate("flat")
      .populate("society")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all payments in a society
export const getSocietyPayments = async (req, res, next) => {
  try {
    const { societyId } = req.params;
    const payments = await Payment.find({ society: societyId })
      .populate("user", "name email")
      .populate("flat");
    res.json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
};
