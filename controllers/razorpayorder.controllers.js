import { razorpay } from "../config/razorpay.js";
import Payment from "../models/payment.js";

export const createOrder = async (req, res) => {
  try {
    const { flatId, amount, month } = req.body;

    const options = {
      amount: amount * 100,  // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order in DB (pending payment)
    const payment = await Payment.create({
      resident: req.user._id,
      flat: flatId,
      society: req.user.society, 
      amount,
      month,
      razorpay_order_id: order.id,
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      payment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

import crypto from "crypto";

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Update payment record
    const payment = await Payment.findOne({ razorpay_order_id });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    payment.status = "paid";
    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    payment.paymentDate = new Date();
    await payment.save();

    res.status(200).json({ success: true, message: "Payment verified", data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
