const bcrypt = require("bcryptjs");
const User = require("../model/users.model.js");
const { reqChecker } = require("../helpers/reqChecker.helpers.js");

/**
 * @description Register a User (Admin creates a teacher OR Teacher self-registers)
 * @route POST /api/users/register
 * @access Public (For teachers) & Admin (For creating teachers)
 */
const userRegistration = async (req, res) => {
  const { name, userName, phone, role, password, grade, profilePicture, isVerified } = req.body;
  
  try {
    // Validate required fields
    const checkerValidation = reqChecker(req, ["name", "userName", "phone", "role", "password", "grade"]);
    if (checkerValidation.length > 0) return res.status(400).json({ message: checkerValidation });

    // Check if user exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if an Admin is creating a teacher profile
    let verifiedStatus = false;
    if (req.user?.role === "admin" && role === "instructor") {
      verifiedStatus = true; // Admin-created teachers are auto-verified
    }

    const user = new User({
      name,
      userName,
      phone,
      password: hashedPassword,
      role,
      grade,
      isVerified: isVerified !== undefined ? isVerified : verifiedStatus, // Set verification based on context
    });

    await user.save();
    return res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @description User Login
 * @route POST /api/users/login
 * @access Public
 */
const userLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!password) return res.status(400).json({ message: "Password is required" });
    if (!userName) return res.status(400).json({ message: "Please provide a userName" });

    const existingUser = await User.findOne({ userName });
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

    return res.status(200).json({ message: "Login successful", user: existingUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get All Instructors
 * @route GET /api/users
 * @access Admin
 */
const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" });
    return res.status(200).json(instructors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get Instructor By ID
 * @route GET /api/users/:id
 * @access Admin
 */
const getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await User.findOne({ _id: id, role: "instructor" });

    if (!instructor) return res.status(404).json({ message: "Instructor not found" });

    return res.status(200).json(instructor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @description Update Instructor
 * @route PUT /api/users/:id
 * @access Admin
 */
const updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, grade, profilePicture, isVerified } = req.body;

    const instructor = await User.findOneAndUpdate(
      { _id: id, role: "instructor" },
      { name, phone, grade, profilePicture, isVerified },
      { new: true, runValidators: true }
    );

    if (!instructor) return res.status(404).json({ message: "Instructor not found" });

    return res.status(200).json({ message: "Instructor updated successfully", instructor });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @description Delete Instructor
 * @route DELETE /api/users/:id
 * @access Admin
 */
const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await User.findOneAndDelete({ _id: id, role: "instructor" });

    if (!instructor) return res.status(404).json({ message: "Instructor not found" });

    return res.status(200).json({ message: "Instructor deleted successfully", instructor });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  userRegistration,
  userLogin,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
};
