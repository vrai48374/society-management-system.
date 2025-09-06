import Flat from "../models/Flat.js";
import Block from "../models/Block.js";

// Create Flat inside a Block
export const createFlat = async (req, res, next) => {
  try {
    const { blockId, flatNumber } = req.body;

    // Check if block exists
    const block = await Block.findById(blockId).populate("society");
    if (!block) {
      return res.status(404).json({ success: false, message: "Block not found" });
    }

    // Prevent duplicate flat numbers in the same block
    const existingFlat = await Flat.findOne({ block: blockId, number: flatNumber });
    if (existingFlat) {
      return res.status(400).json({ success: false, message: "Flat number already exists in this block" });
    }

    // Create flat (auto-assign society from block)
    const flat = await Flat.create({
      number: flatNumber,
      block: blockId,
      society: block.society, // 🔹 auto pick society
    });

    // ✅ Push into block.flats
    if (!block.flats.includes(flat._id)) {
      block.flats.push(flat._id);
    }
    block.totalFlats = block.flats.length;
    await block.save();

    res.status(201).json({ success: true, data: flat });
  } catch (err) {
    next(err);
  }
};


// Get all Flats of a Block
export const getFlatsByBlock = async (req, res, next) => {
  try {
    const { blockId } = req.params;
    const flats = await Flat.find({ block: blockId }).populate("owner", "name email");

    res.status(200).json({ success: true, data: flats });
  } catch (err) {
    next(err);
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
    next(err); // Pass error to errorHandler middleware
  }
};

// controllers/flat.controller.js
export const getAllFlats = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, blockId } = req.query;

    const query = blockId ? { block: blockId } : {};

    const flats = await Flat.find(query)
      .populate("owner", "name email") // only show basic owner info
      .populate("block", "name")       // block name only
      .populate("society", "name")     // society name only
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Flat.countDocuments(query);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: flats,
    });
  } catch (err) {
    next(err);
  }
};
