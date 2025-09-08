import Flat from "../models/Flat.js";
import Block from "../models/Block.js";

// Create Flat inside a Block

export const createFlat = async (req, res, next) => {
  try {
    // accept both styles: blockId/block, flatNumber/number, societyId/society
    const { blockId, block, flatNumber, number, societyId, society, owner } = req.body;

    const blockRef = blockId || block;          // support both blockId and block
    const flatNum = flatNumber || number;       // support both flatNumber and number
    const societyRef = societyId || society;    // support both societyId and society

    if (!blockRef || !societyRef || !flatNum) {
      return res.status(400).json({ success: false, message: "blockId, societyId and flatNumber are required" });
    }

    const blockDoc = await Block.findById(blockRef);
    if (!blockDoc) {
      return res.status(404).json({ success: false, message: "Block not found" });
    }

    // ✅ Restrict admin to their assigned society
    if (req.user.role === "admin" && req.user.assignedSociety.toString() !== blockDoc.society.toString()) {
      return res.status(403).json({ success: false, message: "Admins can only manage their own society" });
    }

    const flat = await Flat.create({
      number: flatNum,
      block: blockRef,
      society: societyRef,
      owner: owner || null
    });

    if (!blockDoc.flats.includes(flat._id)) {
      blockDoc.flats.push(flat._id);
    }
    await blockDoc.save();

    res.status(201).json({ success: true, data: flat });
  } catch (err) {
    next(err);
  }
};

export const updateFlat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { number } = req.body;

    const flat = await Flat.findById(id).populate("block");
    if (!flat) {
      return res.status(404).json({ success: false, message: "Flat not found" });
    }

    // Restrict admin to their assigned society
    if (req.user.role === "admin" && req.user.assignedSociety.toString() !== flat.block.society.toString()) {
      return res.status(403).json({ success: false, message: "Admins can only manage their own society" });
    }

    flat.number = number || flat.number;
    await flat.save();

    res.status(200).json({ success: true, data: flat });
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
export const deleteFlat = async (req, res, next) => {
  try {
    const { id } = req.params;

    const flat = await Flat.findById(id).populate("block");
    if (!flat) {
      return res.status(404).json({ success: false, message: "Flat not found" });
    }

    // Restrict admin to their assigned society
    if (req.user.role === "admin" && req.user.assignedSociety.toString() !== flat.block.society.toString()) {
      return res.status(403).json({ success: false, message: "Admins can only manage their own society" });
    }

    // Remove flat reference from block
    const block = await Block.findById(flat.block._id);
    if (block) {
      block.flats = block.flats.filter(fId => fId.toString() !== flat._id.toString());
      await block.save();
    }

    await flat.remove();

    res.status(200).json({ success: true, message: "Flat deleted successfully" });
  } catch (err) {
    next(err);
  }
};
