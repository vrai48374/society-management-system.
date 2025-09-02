import Flat from "../models/Flat.js";
import Block from "../models/Block.js";

// Create Flat inside a Block
export const createFlat = async (req, res) => {
  try {
    const { blockId, flatNumber } = req.body;

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
    const flat = await Flat.create({ blockId, flatNumber });

    // Update block flat count
    block.totalFlats += 1;
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
