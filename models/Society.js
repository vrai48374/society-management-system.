import mongoose from "mongoose";

const societySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  blocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
    },
  ],
});

export default mongoose.model("Society", societySchema);
