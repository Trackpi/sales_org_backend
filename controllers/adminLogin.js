const Admin = require("../models/adminmodel");
const jwt = require("jsonwebtoken");
const adminHisModel = require("../models/adminPanelHistory");
const bcrypt = require("bcrypt");

// Admin Login
exports.adminlogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ error: "Invalid credentials." });
    }

    // Check hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(403).json({ error: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_KEY, {
      expiresIn: "1h", // Token expiration time
    });

    // Log the admin action
    await adminHisModel.create({ adminid: admin._id, action: 'logined' });

    res.status(200).json({ token: `${token}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error." });
  }
};