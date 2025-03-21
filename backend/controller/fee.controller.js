const Fee = require("../model/fees.model");
const Student = require("../model/student.model");

/**
 * @description Get all fees (Admin only)
 * @route GET /api/fees
 * @access Admin
 */
const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate("studentId teacherId month classID");
    return res.status(200).json(fees);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get fees for a specific student
 * @route GET /api/fees/student/:studentId
 * @access Teachers & Admin
 */
const getFeesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const fees = await Fee.find({ studentId })
      .populate("teacherId month classID");

    if (!fees.length) return res.status(404).json({ message: "No fees found for this student" });

    return res.status(200).json(fees);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get all unpaid fees for a student
 * @route GET /api/fees/student/:studentId/unpaid
 * @access Teachers & Admin
 */
const getUnpaidFeesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const fees = await Fee.find({ studentId, status: "Unpaid" })
      .populate("teacherId month classID");

    if (!fees.length) return res.status(404).json({ message: "No unpaid fees found" });

    return res.status(200).json(fees);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @description Update fee details (Only Teachers)
 * @route PUT /api/fees/:feeId
 * @access Teachers only (Can only update fees assigned to them)
 */
const updateFee = async (req, res) => {
  try {
    const { feeId } = req.params;
    const { amount, status, paymentDate } = req.body;

    // Find the fee record
    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    // Ensure the teacher updating the fee is the assigned teacher
    if (req.user.role !== "admin" && req.user._id.toString() !== fee.teacherId.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this fee record" });
    }

    // Update fee details
    fee.amount = amount || fee.amount;
    fee.status = status || fee.status;
    fee.paymentDate = paymentDate || fee.paymentDate;

    await fee.save();
    return res.status(200).json({ message: "Fee updated successfully", fee });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @description Delete fee (Admin only)
 * @route DELETE /api/fees/:feeId
 * @access Admin
 */
const deleteFee = async (req, res) => {
  try {
    const { feeId } = req.params;

    const fee = await Fee.findByIdAndDelete(feeId);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    return res.status(200).json({ message: "Fee deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllFees,
  getFeesByStudent,
  getUnpaidFeesByStudent,
  updateFee,
  deleteFee
};
