import Payment from "../models/payment.js";

// Get my payment history (Resident)
export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ resident: req.user._id })
      .populate("flat", "number")
      .populate("society", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all payments of a society
export const getPaymentsBySociety = async (req, res, next) => {
  try {
    const { societyId } = req.params;

    const payments = await Payment.find({ society: societyId })
      .populate("resident", "name email")
      .populate("flat", "number")
      .sort({ createdAt: -1 });

    if (!payments.length) {
      return res.status(404).json({ success: false, message: "No payments found" });
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get monthly payment summary for a society
export const getPaymentSummary = async (req, res, next) => {
  try {
    const { societyId } = req.params;
    const { month } = req.query; // e.g., ?month=2025-09

    const match = { society: societyId };
    if (month) {
      match.month = month;
    }

    const summary = await Payment.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalCollected = summary.find((s) => s._id === "paid")?.totalAmount || 0;
    const totalPending = summary.find((s) => s._id === "pending")?.totalAmount || 0;

    res.status(200).json({
      success: true,
      month: month || "all",
      totalCollected,
      totalPending,
      summary
    });
  } catch (err) {
    next(err);
  }
};


