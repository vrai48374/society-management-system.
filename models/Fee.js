// models/Fee.js
import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Society",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  frequency: {
    type: String,
    enum: ["monthly", "quarterly", "yearly", "one-time"],
    default: "monthly"
  },
  dueDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: String
}, { timestamps: true });

export default mongoose.model("Fee", feeSchema);