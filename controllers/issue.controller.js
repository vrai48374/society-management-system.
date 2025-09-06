import Issue from "../models/Issue.js";
import Flat from "../models/Flat.js";

// Create Issue (Resident)
export const createIssue = async (req, res) => {
  try {
    const { title, description, flatId, priority } = req.body;

    const flat = await Flat.findById(flatId).populate("block");
    if (!flat) {
      return res.status(404).json({ success: false, message: "Flat not found" });
    }

    const issue = await Issue.create({
      title,
      description,
      priority,
      raisedBy: req.user._id,
      flat: flat._id,
      block: flat.block._id,
      society: flat.society,
    });

    res.status(201).json({ success: true, data: issue });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all Issues (Admin/Superadmin)
export const getAllIssues = async (req, res) => {
  try {
    console.log("👉 Resident ID from token:", req.user._id);
    const issues = await Issue.find()
      .populate("raisedBy", "name email")
      .populate("flat", "number")
      .populate("block", "name")
      .populate("society", "name");
    res.status(200).json({ success: true, data: issues });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Issues of a Resident
export const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ raisedBy: req.user._id })
      .populate("flat", "number")
      .populate("block", "name")
      .populate("society", "name");
    res.status(200).json({ success: true, data: issues });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Issue Status (Generic Admin Update)
export const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }
    res.status(200).json({ success: true, data: issue });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Resolve Issue (Admin only)
export const resolveIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    if (req.user.role === "admin" || req.user.role === "superadmin") {
      issue.status = "resolved";
      await issue.save();
      return res.status(200).json({ success: true, message: "Issue marked as resolved", data: issue });
    }

    return res.status(403).json({ success: false, message: "Only admins can mark as resolved" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Close Issue (Resident or Admin)
export const closeIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    if (
      issue.raisedBy.toString() === req.user._id.toString() ||
      req.user.role === "admin" ||
      req.user.role === "superadmin"
    ) {
      issue.status = "closed";
      await issue.save();
      return res.status(200).json({ success: true, message: "Issue closed", data: issue });
    }

    return res.status(403).json({ success: false, message: "Not allowed to close this issue" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
