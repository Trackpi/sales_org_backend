const Admin = require("../models/adminmodel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middlewares/emailService");


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

    // Check plain-text password (no hashing)
    if (admin.password !== password) {
      await sendEmail(
        admin.email,
        "Incorrect Password Attempt",
        `Dear ${admin.username}, there was an incorrect password attempt for your account. If this wasn't you, please secure your account immediately.`
      );
      return res.status(403).json({ error: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_KEY, {
      expiresIn: "1h", // Token expiration time
    });

    res.status(200).json({ token: `${token}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error." });
  }
};
