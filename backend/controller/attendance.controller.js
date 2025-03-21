const Attendance = require("../model/attendance.model");
const Students = require("../model/student.model");
const mongoose = require("mongoose");

/**
 * @description Mark Attendance (Only assigned teachers or admins)
 * @route POST /attendance
 * @access Teachers & Admins
 */
const markAttendance = async (req, res) => {
  const { studentId, classId, status } = req.body;
  const teacherId = req.user._id;

  try {
    // Validate required fields
    if (!studentId || !classId || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if student exists
    const student = await Students.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Check if user is admin or the assigned teacher
    if (req.user.role !== "admin" && student.assignedBy.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: "Not authorized to mark attendance for this student" });
    }

    // Create new attendance record
    const newAttendance = new Attendance({
      studentId,
      teacherId,
      classId,
      status,
    });

    await newAttendance.save();
    return res.status(201).json({ message: "Attendance marked successfully", newAttendance });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @description Get All Attendance Records
 * @route GET /attendance
 * @access Admins & Teachers (Only their students)
 */
const getAllAttendance = async (req, res) => {
  try {
    let attendanceRecords;
    
    if (req.user.role === "admin") {
      attendanceRecords = await Attendance.find().populate("studentId teacherId classId");
    } else {
      attendanceRecords = await Attendance.find({ teacherId: req.user._id }).populate("studentId classId");
    }

    if (attendanceRecords.length === 0) return res.status(404).json({ message: "No attendance records found" });

    return res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @description Get Attendance by Student
 * @route GET /attendance/student/:studentId
 * @access Admins & Assigned Teachers
 */
const getAttendanceByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const attendanceRecords = await Attendance.find({ studentId }).populate("studentId teacherId classId");

    if (attendanceRecords.length === 0) return res.status(404).json({ message: "No attendance records found for this student" });

    return res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @description Update Attendance Record (Only assigned teacher or admin)
 * @route PUT /attendance/:id
 * @access Admins & Assigned Teachers
 */
const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid Attendance ID" });

    const attendance = await Attendance.findById(id);
    if (!attendance) return res.status(404).json({ message: "Attendance record not found" });

    // Check if user is admin or assigned teacher
    if (req.user.role !== "admin" && req.user._id.toString() !== attendance.teacherId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this attendance record" });
    }

    // Update attendance record
    attendance.status = status;
    await attendance.save();

    return res.status(200).json({ message: "Attendance updated successfully", attendance });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @description Delete Attendance Record (Admins Only)
 * @route DELETE /attendance/:id
 * @access Admins Only
 */
const deleteAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid Attendance ID" });

    const deletedAttendance = await Attendance.findByIdAndDelete(id);

    if (!deletedAttendance) return res.status(404).json({ message: "Attendance record not found" });

    return res.status(200).json({ message: "Attendance deleted successfully", deletedAttendance });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { markAttendance, getAllAttendance, getAttendanceByStudent, updateAttendance, deleteAttendance };
