import Society from "../models/Society.js";

// Create a new Society
export const createSociety = async (req, res) => {
  try {
    const society = await Society.create({
      name: req.body.name,
      address: req.body.address,
      blocks: req.body.blocks,
      flatsPerBlock: req.body.flatsPerBlock,
      createdBy: req.user._id, // who created it
    });
    res.status(201).json(society);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Societies
export const getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    res.json(societies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Society by ID
export const getSocietyById = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);
    if (!society) return res.status(404).json({ message: "Society not found" });
    res.json(society);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Society
export const updateSociety = async (req, res) => {
  try {
    const society = await Society.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!society) return res.status(404).json({ message: "Society not found" });
    res.json(society);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Society
export const deleteSociety = async (req, res) => {
  try {
    const society = await Society.findByIdAndDelete(req.params.id);
    if (!society) return res.status(404).json({ message: "Society not found" });
    res.json({ message: "Society deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Society → Blocks
export const getSocietyWithBlocks = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id).populate("blocks");
    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }
    res.status(200).json({ success: true, data: society });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
