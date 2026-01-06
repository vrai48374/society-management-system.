import Flat from "../models/Flat.js";
import Block from "../models/Block.js";

// CREATE FLAT
export const createFlat = async (req, res, next) => {
  try {
    const { blockId, block, flatNumber, number, owner } = req.body;

    const blockRef = blockId || block;
    const flatNum = flatNumber || number;

    if (!blockRef || !flatNum) {
      return res.status(400).json({
        success: false,
        message: "blockId and flatNumber are required"
      });
    }

    const blockDoc = await Block.findById(blockRef);
    if (!blockDoc) {
      return res.status(404).json({ success: false, message: "Block not found" });
    }

    const flat = await Flat.create({
      number: flatNum,
      block: blockRef,
      society: req.society._id,
      owner: owner || null
    });

    blockDoc.flats.push(flat._id);
    await blockDoc.save();

    res.status(201).json({ success: true, data: flat });
  } catch (err) {
    next(err);
  }
};

// GET FLATS BY BLOCK
export const getFlatsByBlock = async (req, res, next) => {
  try {
    const flats = await Flat.find({ block: req.params.blockId })
      .populate("owner", "name email");

    res.status(200).json({ success: true, data: flats });
  } catch (err) {
    next(err);
  }
};

// GET FLATS BY SOCIETY
export const getFlatsBySociety = async (req, res, next) => {
  try {
    const flats = await Flat.find({ society: req.society._id })
      .populate("owner")
      .populate("block");

    res.status(200).json({ success: true, data: flats });
  } catch (err) {
    next(err);
  }
};

// DELETE FLAT
export const deleteFlat = async (req, res, next) => {
  try {
    const flat = await Flat.findById(req.params.id).populate("block");
    if (!flat) {
      return res.status(404).json({ success: false, message: "Flat not found" });
    }

    if (flat.block) {
      await Block.findByIdAndUpdate(flat.block._id, {
        $pull: { flats: flat._id }
      });
    }

    await flat.deleteOne();
    res.status(200).json({ success: true, message: "Flat deleted" });
  } catch (err) {
    next(err);
  }
};
