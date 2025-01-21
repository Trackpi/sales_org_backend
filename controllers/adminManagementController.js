const bcrypt = require('bcrypt');
const Admin = require('../models/adminManagementModel');
const adminhistory = require('../models/adminPanelHistory');

// Create a new admin
const createAdmin = async (req, res) => {
  const adminid = req.adminid;
  try {
    const { username, email, password, fullname, role } = req.body;
    const profilePic = req.file ? `/uploads/images/${req.file.filename}` : null;

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
      fullname,
      role,
      profilePic,
    });

    await newAdmin.save();
    await adminhistory.create({ adminid, action: 'New admin added' });

    res.status(201).json({
      message: 'Admin added successfully',
      admin: {
        username: newAdmin.username,
        email: newAdmin.email,
        fullname: newAdmin.fullname,
        role: newAdmin.role,
        profilePic: newAdmin.profilePic,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding admin', error });
  }
};

// Fetch all admins
const getAllAdmins = async (req, res) => {
  const adminid = req.adminid;
  try {
    const admins = await Admin.find().select('-password'); // Exclude passwords from the response

    await adminhistory.create({ adminid, action: 'Fetched all admins' });

    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching admins', error });
  }
};

// Edit admin details
const editAdmin = async (req, res) => {
  const adminid = req.adminid;
  try {
    const { username } = req.params;
    const { newUsername, newEmail, newPassword, newFullname, newRole } = req.body;
    const profilePic = req.file ? `/uploads/images/${req.file.filename}` : null;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update fields if provided
    if (newUsername) admin.username = newUsername;
    if (newEmail) admin.email = newEmail;
    if (newPassword) admin.password = await bcrypt.hash(newPassword, 10);
    if (newFullname) admin.fullname = newFullname;
    if (newRole) admin.role = newRole;
    if (profilePic) admin.profilePic = profilePic;

    await admin.save();
    await adminhistory.create({
      adminid,
      action: `Admin details updated for user ID: ${admin._id}`,
    });

    res.status(200).json({ message: 'Admin updated successfully', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating admin', error });
  }
};

// Delete an admin
const deleteAdmin = async (req, res) => {
  const adminid = req.adminid;
  try {
    const { username } = req.params;

    const admin = await Admin.findOneAndDelete({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await adminhistory.create({
      adminid,
      action: `Admin deleted with user ID: ${admin._id}`,
    });

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting admin', error });
  }
};

const searchAdmins = async (req, res) => {
  const adminid = req.adminid; // Use this for logging history
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Perform a case-insensitive search for username, fullname, or email
    const admins = await Admin.find({
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { fullname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('-password'); // Exclude passwords from the response

    await adminhistory.create({
      adminid,
      action: `Searched admins with query: "${search}"`,
    });

    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching admins', error });
  }
};


module.exports = { createAdmin, getAllAdmins, editAdmin, deleteAdmin,searchAdmins };
