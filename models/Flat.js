import mongoose from "mongoose";

const flatSchema = new mongoose.Schema(
  {
    blockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      required: true,
    },
    flatNumber: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Initially no owner
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Flat", flatSchema);
