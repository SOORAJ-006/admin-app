const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getAllAttendance,
  getAttendanceByStudent,
  updateAttendance,
  deleteAttendance,
} = require("../controller/attendance.controller");
const { authMiddleware, adminAuth, teacherAuth } = require("../middleware/authMiddleware");

// Admin & Teacher Routes
router.get("/", authMiddleware, getAllAttendance);
router.get("/student/:studentId", authMiddleware, getAttendanceByStudent);
router.post("/", teacherAuth, markAttendance);
router.put("/:id", authMiddleware, updateAttendance);

// Admin Only Routes
router.delete("/:id", adminAuth, deleteAttendance);

module.exports = router;
