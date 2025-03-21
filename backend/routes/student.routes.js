const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controller/student.controller");

router
  .get("/", getAllStudents)
  .get("/:id", getStudent)
  .post("/", createStudent)
  .put("/:id", updateStudent)
  .delete("/:id", deleteStudent);

  module.exports = router;