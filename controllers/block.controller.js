import Block from "../models/Block.js";
import Society from "../models/Society.js";

// Create Block inside a Society
export const createBlock = async (req, res, next) => {
  try {
    const { blockName } = req.body;

    // Use assigned society for admin, or req.body for superadmin
    const societyId = req.user.role === "admin" ? req.user.assignedSociety : req.body.societyId;

    // 1️ Check if society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }

    // 2️ Restrict admin to their assigned society (already handled by assignedSociety)
    // 3️ Create block
    const block = await Block.create({ name: blockName, society: societyId });

    if (!society.blocks.includes(block._id)) {
      society.blocks.push(block._id);
      society.totalBlocks = society.blocks.length;
      await society.save();
    }

    res.status(201).json({ success: true, data: block });
  } catch (err) {
    next(err);
  }
};

export const updateBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const block = await Block.findById(id);
    if (!block) {
      return res.status(404).json({ success: false, message: "Block not found" });
    }

    // Restrict admin to their assigned society
    if (req.user.role === "admin" && req.user.assignedSociety.toString() !== block.society.toString()) {
      return res.status(403).json({ success: false, message: "Admins can only manage their own society" });
    }

    block.name = name || block.name;
    await block.save();

    res.status(200).json({ success: true, data: block });
  } catch (err) {
    next(err);
  }
};


// Get all Blocks of a Society
export const getBlocksBySociety = async (req, res) => {
  try {
    const { societyId } = req.params;
    const blocks = await Block.find({ society: societyId }); // ✅ use "society" field, not societyId
    res.status(200).json({ success: true, data: blocks });
  } catch (err) {
    next(err); // Pass error to errorHandler middleware
  }
};

// Get Block with its Flats
export const getBlockWithFlats = async (req, res) => {
  try {
    const { id } = req.params;

    const block = await Block.findById(id).populate("flats");
    if (!block) {
      return res.status(404).json({ success: false, message: "Block not found" });
    }

    res.status(200).json({ success: true, data: block });
  } catch (err) {
    next(err); // Pass error to errorHandler middleware
  }
};

// controllers/block.controller.js
export const getAllBlocks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, societyId } = req.query;

    const query = societyId ? { society: societyId } : {};

    const blocks = await Block.find(query)
      .populate("society", "name") // only society name
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Block.countDocuments(query);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: blocks,
    });
  } catch (err) {
    next(err);
  }
};
export const deleteBlock = async (req, res, next) => {
  try {
    const { id } = req.params;

    const block = await Block.findById(id);
    if (!block) {
      return res.status(404).json({ success: false, message: "Block not found" });
    }

    // Restrict admin to their assigned society
    if (req.user.role === "admin" && req.user.assignedSociety.toString() !== block.society.toString()) {
      return res.status(403).json({ success: false, message: "Admins can only manage their own society" });
    }

    // Remove block reference from society
    const society = await Society.findById(block.society);
    if (society) {
      society.blocks = society.blocks.filter(bId => bId.toString() !== block._id.toString());
      society.totalBlocks = society.blocks.length;
      await society.save();
    }

    await block.deleteOne();

    res.status(200).json({ success: true, message: "Block deleted successfully" });
  } catch (err) {
    next(err);
  }
};
