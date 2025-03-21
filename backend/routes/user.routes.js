const express = require("express");
const router = express.Router();
const {
  userRegistration,
  userLogin,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor
} = require("../controller/user.controller");

// Public Routes
router.post("/register", userRegistration)
.post("/login", userLogin)
.get("/", getAllInstructors)
.get("/:id", getInstructorById)
.put("/:id", updateInstructor)
.delete("/:id", deleteInstructor);

module.exports = router;
