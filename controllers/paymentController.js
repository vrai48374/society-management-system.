// controllers/paymentController.js
import Payment from "../models/Payment.js";
import Fee from "../models/Fee.js";
import User from "../models/User.js";

// Record a payment
export const recordPayment = async (req, res) => {
  try {
    const { userId, flatId, feeId, amount, paymentMethod, transactionId } = req.body;
    
    // Check if user is admin or superadmin
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin rights required." });
    }
    
    // Verify fee exists
    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee not found" });
    }
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const payment = new Payment({
      user: userId,
      flat: flatId,
      society: fee.society,
      fee: feeId,
      amount,
      paymentMethod,
      transactionId,
      recordedBy: req.user.id
    });
    
    await payment.save();
    
    // Populate the payment details for response
    await payment.populate("fee user recordedBy");
    
    res.status(201).json({ 
      success: true,
      message: "Payment recorded successfully", 
      payment,
      receiptNumber: payment.receiptNumber
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all payments with filters
export const getPayments = async (req, res) => {
  try {
    const { userId, startDate, endDate, status } = req.query;
    let filters = {};
    
    // If user is not admin/superadmin, only show their payments
    if (req.user.role === "resident") {
      filters.user = req.user.id;
    } else {
      if (userId) filters.user = userId;
      
      // For admin users, only show payments from their society
      const societyId = req.user.society?._id || req.user.society;
      if (societyId) filters.society = societyId;
    }
    
    if (status) filters.status = status;
    
    if (startDate || endDate) {
      filters.paymentDate = {};
      if (startDate) filters.paymentDate.$gte = new Date(startDate);
      if (endDate) filters.paymentDate.$lte = new Date(endDate);
    }
    
    const payments = await Payment.find(filters)
      .populate("user", "name email")
      .populate("flat", "number")
      .populate("fee", "name amount")
      .populate("recordedBy", "name")
      .sort({ paymentDate: -1 });
    
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId)
      .populate("user", "name email")
      .populate("flat", "number block")
      .populate("fee", "name amount frequency")
      .populate("recordedBy", "name")
      .populate("society", "name");
    
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    
    // Check if user has access to this payment
    if (req.user.role === "resident" && payment.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's payment history
export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const payments = await Payment.find({ user: userId })
      .populate("fee", "name amount frequency")
      .populate("recordedBy", "name")
      .sort({ paymentDate: -1 });
    
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;
    
    // Check if user is admin or superadmin
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin rights required." });
    }
    
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    ).populate("fee user recordedBy");
    
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    
    res.status(200).json({ success: true, message: "Payment status updated successfully", payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};