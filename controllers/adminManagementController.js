const bcrypt = require('bcrypt');
const Admin = require('../models/adminManagementModel');

// Create a new admin
const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({
      message: 'Admin added successfully',
      admin: { username: newAdmin.username, email: newAdmin.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding admin', error });
  }
};

// Fetch all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password'); // Exclude passwords from the response
    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching admins', error });
  }
};

// Edit admin details
const editAdmin = async (req, res) => {
  try {
    const { username } = req.params;
    const { newUsername, newEmail, newPassword } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update fields if provided
    if (newUsername) admin.username = newUsername;
    if (newEmail) admin.email = newEmail;
    if (newPassword) admin.password = await bcrypt.hash(newPassword, 10);

    await admin.save();
    res.status(200).json({ message: 'Admin updated successfully', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating admin', error });
  }
};

// Delete an admin
const deleteAdmin = async (req, res) => {
  try {
    const { username } = req.params;

    const admin = await Admin.findOneAndDelete({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting admin', error });
  }
};

module.exports = { createAdmin, getAllAdmins, editAdmin, deleteAdmin };
