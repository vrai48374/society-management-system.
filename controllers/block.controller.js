import Block from "../models/Block.js";
import Society from "../models/Society.js";

// Create Block inside a Society
export const createBlock = async (req, res) => {
  try {
    const { societyId, blockName } = req.body;

    // 1️⃣ Check if society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }

    // 2️⃣ Create block with society reference
    const block = await Block.create({
  name: blockName,
  society: societyId,
});

// ✅ Push block into society.blocks only if not exists
if (!society.blocks.includes(block._id)) {
  society.blocks.push(block._id);
}
society.totalBlocks = society.blocks.length;
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
    const blocks = await Block.find({ society: societyId }); // ✅ use "society" field, not societyId
    res.status(200).json({ success: true, data: blocks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    res.status(500).json({ success: false, message: err.message });
  }
};