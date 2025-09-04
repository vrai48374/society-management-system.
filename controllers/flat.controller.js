import Flat from "../models/Flat.js";
import Block from "../models/Block.js";

// Create Flat inside a Block
export const createFlat = async (req, res) => {
  try {
    const { blockId, flatNumber, societyId } = req.body;

    // Check if block exists
    const block = await Block.findById(blockId);
    if (!block) {
      return res.status(404).json({ success: false, message: "Block not found" });
    }

    // Prevent duplicate flat numbers in the same block
    const existingFlat = await Flat.findOne({ blockId, flatNumber });
    if (existingFlat) {
      return res.status(400).json({ success: false, message: "Flat number already exists in this block" });
    }

    // Create flat
    const flat = await Flat.create({
  number: flatNumber,
  block: blockId,
});

// ✅ Push into block.flats
if (!block.flats.includes(flat._id)) {
  block.flats.push(flat._id);
}
block.totalFlats = block.flats.length;
await block.save();


    res.status(201).json({ success: true, data: flat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all Flats of a Block
export const getFlatsByBlock = async (req, res) => {
  try {
    const { blockId } = req.params;
    const flats = await Flat.find({ blockId }).populate("owner", "name email");
    res.status(200).json({ success: true, data: flats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Flat with its User
export const getFlatsBySociety = async (req, res) => {
  try {
    const flats = await Flat.find({ society: req.params.societyId })
      .populate("owner")   // get user details
      .populate("block");  // get block details

    if (!flats || flats.length === 0) {
      return res.status(404).json({ success: false, message: "No flats found in this society" });
    }

    res.status(200).json({ success: true, count: flats.length, data: flats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};