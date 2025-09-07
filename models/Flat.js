import mongoose from "mongoose";

const flatSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  block: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Block",   // 🔹 This is required for populate()
    required: true,
  },
  society: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
  residents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

// Prevent duplicate flat numbers inside the same block
flatSchema.index({ block: 1, number: 1 }, { unique: true });

export default mongoose.model("Flat", flatSchema);
