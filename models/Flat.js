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
  residents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model("Flat", flatSchema);
