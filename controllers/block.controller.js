import Block from "../models/Block.js";
import Society from "../models/Society.js";

// Create Block inside a Society
export const createBlock = async (req, res) => {
  try {
    const { societyId, blockName } = req.body;

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }

    const block = await Block.create({ societyId, blockName });

    // update society block count
    society.totalBlocks += 1;
    await society.save();

    res.status(201).json({ success: true, data: block });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all Blocks of a Society
export const getBlocksBySociety = async (req, res) => {
  try {
    const { societyId } = req.params;
    const blocks = await Block.find({ societyId });
    res.status(200).json({ success: true, data: blocks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
