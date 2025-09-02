import mongoose from "mongoose";

const societySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
});

export default mongoose.model("Society", societySchema);
