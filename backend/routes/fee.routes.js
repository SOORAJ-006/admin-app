const express = require("express");
const router = express.Router();
const {
  getAllFees,
  getFeesByStudent,
  getUnpaidFeesByStudent,
  updateFee,
  deleteFee
} = require("../controllers/feeController");
const { authMiddleware, adminAuth, teacherAuth } = require("../middleware/authMiddleware");

// Admin Routes
router.get("/", adminAuth, getAllFees);
router.delete("/:feeId", adminAuth, deleteFee);

// Teacher & Admin Routes
router.get("/student/:studentId", authMiddleware, getFeesByStudent);
router.get("/student/:studentId/unpaid", authMiddleware, getUnpaidFeesByStudent);
router.put("/:feeId", teacherAuth, updateFee);

module.exports = router;
