import mongoose from "mongoose";

const flatSchema = new mongoose.Schema({
  blockId: { type: mongoose.Schema.Types.ObjectId, ref: "Block", required: true },
  flatNumber: { type: String, required: true },
  residents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // multiple users can live in 1 flat
});

export default mongoose.model("Flat", flatSchema);
