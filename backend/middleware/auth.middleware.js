const jwt = require("jsonwebtoken");
const User = require("../model/users.model");

// Verify JWT Token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin Auth Middleware
const adminAuth = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Admins only." });
  }
  next();
};

// Teacher Auth Middleware
const teacherAuth = (req, res, next) => {
  if (req.user?.role !== "teacher") {
    return res.status(403).json({ message: "Access Denied. Teachers only." });
  }
  next();
};

module.exports = { authMiddleware, adminAuth, teacherAuth };
