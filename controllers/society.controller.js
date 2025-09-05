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
    next(error); // Pass error to errorHandler middleware
  }
};

// Get all Societies

// Get Society by ID
export const getSocietyById = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);
    if (!society) return res.status(404).json({ message: "Society not found" });
    res.json(society);
  } catch (error) {
    next(error); // Pass error to errorHandler middleware
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
    next(error); // Pass error to errorHandler middleware
  }
};

// Delete Society
export const deleteSociety = async (req, res) => {
  try {
    const society = await Society.findByIdAndDelete(req.params.id);
    if (!society) return res.status(404).json({ message: "Society not found" });
    res.json({ message: "Society deleted successfully" });
  } catch (error) {
    next(error); // Pass error to errorHandler middleware
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
    next(err); // Pass error to errorHandler middleware
  }
};

// Society → Blocks → Flats → Users
export const getSocietyDetails = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id)
      .populate({
        path: "blocks",
        populate: {
          path: "flats",
          populate: {
            path: "users", // ✅ users inside flats
            select: "name email role" // only essential fields
          }
        }
      });

    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }

    res.status(200).json({ success: true, data: society });
  } catch (err) {
    next(err); // Pass error to errorHandler middleware
  }
};
// controllers/society.controller.js
export const getAllSocieties = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const societies = await Society.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Society.countDocuments();

    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: societies,
    });
  } catch (err) {
    next(err);
  }
};
