// controllers/feeController.js
import Fee from "../models/Fee.js";
import Society from "../models/Society.js";

// Create a new fee
export const createFee = async (req, res) => {
  try {
    const { name, amount, frequency, dueDate, description } = req.body;
    
    // Check if user is admin or superadmin
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin rights required." });
    }
    
    // Use the society from the authenticated user
    const societyId = req.user.society?._id || req.user.society;
    
    if (!societyId) {
      return res.status(400).json({ success: false, message: "User is not associated with any society" });
    }
    
    const fee = new Fee({
      society: societyId,
      name,
      amount,
      frequency,
      dueDate,
      description
    });
    
    await fee.save();
    res.status(201).json({ success: true, message: "Fee created successfully", fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all fees for a society
export const getFees = async (req, res) => {
  try {
    const societyId = req.user.society?._id || req.user.society;
    
    if (!societyId) {
      return res.status(400).json({ success: false, message: "User is not associated with any society" });
    }
    
    const fees = await Fee.find({ society: societyId, isActive: true });
    res.status(200).json({ success: true, fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a fee
export const updateFee = async (req, res) => {
  try {
    const { feeId } = req.params;
    const updates = req.body;
    
    // Check if user is admin or superadmin
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin rights required." });
    }
    
    const fee = await Fee.findByIdAndUpdate(feeId, updates, { new: true });
    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee not found" });
    }
    
    res.status(200).json({ success: true, message: "Fee updated successfully", fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a fee (soft delete)
export const deleteFee = async (req, res) => {
  try {
    const { feeId } = req.params;
    
    // Check if user is admin or superadmin
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin rights required." });
    }
    
    const fee = await Fee.findByIdAndUpdate(
      feeId, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee not found" });
    }
    
    res.status(200).json({ success: true, message: "Fee deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};