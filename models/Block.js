import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    blockName: {
      type: String,
      required: true,
      trim: true,
    },
    totalFlats: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Block", blockSchema);
