import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  flats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
    },
  ],
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Society",
    required: true,
  },
});

export default mongoose.model("Block", blockSchema);
