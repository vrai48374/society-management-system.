import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true },
  society: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },

  amount: { type: Number, required: true },
  month: { type: String, required: true },  // e.g. "Sep-2025"
  status: { type: String, enum: ["pending", "paid"], default: "pending" },

  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },

  paymentDate: { type: Date },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
