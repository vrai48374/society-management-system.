// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  flat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flat",
    required: true
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Society",
    required: true
  },
  fee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fee",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ["upi", "net_banking", "cash", "card"],
    required: true
  },
  transactionId: { 
    type: String,
    required: function () {
      return this.paymentMethod !== "cash"; 
    } 
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "completed"
  },
  receiptNumber: {
    type: String,
    unique: true
  }
}, { timestamps: true });

// Generate receipt number before saving
paymentSchema.pre("save", async function(next) {
  if (this.isNew && !this.receiptNumber) {
    const count = await mongoose.model("Payment").countDocuments();
    this.receiptNumber = `RCPT${Date.now()}${count.toString().padStart(6, '0')}`;
  }
  next();
});

export default mongoose.model("Payment", paymentSchema);