// controllers/ticket.controller.js
import Ticket from "../models/Ticket.js";
import Flat from "../models/Flat.js";

export const createTicket = async (req, res, next) => {
  try {
    const { title, description, flatId, priority } = req.body;

    const flat = await Flat.findById(flatId).populate({
      path: "block",
      populate: { path: "society" },
    });

    if (!flat) return res.status(404).json({ success: false, message: "Flat not found" });

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      flat: flat._id,
      block: flat.block._id,
      society: flat.block.society._id,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id })
      .populate("flat block society")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    next(error);
  }
};

export const getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find()
      .populate("createdBy", "name email")
      .populate("flat block society")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    res.status(200).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};
