import mongoose from "mongoose";

const societySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    blocks: {
      type: Number,
      default: 1,
    },
    flatsPerBlock: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // which admin created the society
      required: true,
    },
  },
  { timestamps: true }
);

const Society = mongoose.model("Society", societySchema);
export default Society;
    