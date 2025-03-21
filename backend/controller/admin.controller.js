const bcrypt = require("bcryptjs");
const User = require("../model/users.model.js");
const { reqChecker } = require("../helpers/reqChecker.helpers.js");

const userRegistration = async (req, res) => {
  const { name, userName, phone,role, password, grade, profilePicture } = req.body;

  try {
    const checkerValidation = reqChecker(req, [
      "name",
      "userName",
      "phone",
      "role",
      "password",
      "grade"
    ]);

    if (checkerValidation.length > 0)
      return res.status(400).json({ message: checkerValidation });

    const existingUser = await User.findOne({ userName });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      userName,
      phone,
      password: hashedPassword,
      role,
      grade,
    });

    return res.status(200).json({ message: "Registration", user });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const userLogin = async (req, res) => {
    try {
      const { userName, password } = req.body;
  
      if (!password) return res.status(400).json({ message: "Password is required" });
  
      let unique = userName || email;
  
      if (!unique)
        return res.status(400).json({ message: "Please provide either userName, email" });
  
      const existingUser = await User.findOne({userName});
  
      if (!existingUser) return res.status(404).json({ message: "User not found" });
  
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });
  
      return res.status(200).json({ message: "Login successful", user: existingUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

module.exports = { userRegistration, userLogin };
