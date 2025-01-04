const Admin = require('../models/adminmodel')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

// Create a new admin
exports.createAdmin = async (req, res) => {
  try {
    const { username, password, adminType } = req.body;

    // Check if username already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // Create a new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, password: hashedPassword, adminType });
    await admin.save();

    res.status(201).json({ message: "Admin created successfully.", admin });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};


// Update an admin
exports.updateAdmin = async (req, res) => {
  try {
    const { username, password, adminType } = req.body;
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Update fields
    if (username) admin.username = username;
    if (password) admin.password = await bcrypt.hash(password, 10);
    if (adminType) admin.adminType = adminType;

    await admin.save();
    res.status(200).json({ message: "Admin updated successfully.", admin });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};


// adminLogin
exports.adminlogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(406).json({ err: "Data not found" });
    }

    const admin = await adminModel.findOne({ username });
    if (!admin) {
      return res.status(406).json({ err: "Invalid credentials" });
    }

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      await sendEmail(
        admin.email,
        "Incorrect Password Attempt",
        `Dear ${admin.name}, there was an incorrect password attempt for your account. If this wasn't you, please secure your account immediately.`
      );
      return res.status(406).json({ err: "Invalid credentials" });
    }


    // Generate JWT token
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_KEY, {
      expiresIn: "1h", // Token expiration time
    });

    res.status(200).json({ token: `Bearer ${token}` });
  }
   catch (err) {
    console.log(err);
    res.status(500).json({ err: "Server side error" });
  }
};