const userModel = require("../models/userModel");
const validation = require("validator");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//login user
const loginUser = async (req, res) => {
  try {
    console.log("[loginUser] req.body:", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill the all fields" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ userid: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .json({ success: true, message: "User Login Successfully", token });
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//register user
const registerUser = async (req, res) => {
  try {
    console.log("[registerUser] req.body:", req.body);
    const { email, password, name } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill the all fields" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (!validation.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userDate = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new userModel(userDate);
    const user = await newUser.save();

    const token = jwt.sign({ userid: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .json({ success: true, message: "User Register Successfully", token });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill the all fields" });
    }

    // Trim whitespace and compare
    const trimmedEmail = email.trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD.trim();

    console.log("Admin Login Attempt:", {
      providedEmail: trimmedEmail,
      expectedEmail: adminEmail,
      passwordMatch: password.trim() === adminPassword,
    });

    if (trimmedEmail === adminEmail && password.trim() === adminPassword) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res
        .status(200)
        .json({ success: true, message: "Admin Login Successfully", token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in admin login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  adminLogin,
};
