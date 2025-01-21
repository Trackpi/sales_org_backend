const Company = require("../models/companyModel");
const adminhistory = require("../models/adminPanelHistory"); 
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Create a new company
exports.createCompany = async (req, res) => {
  const adminid = req.adminid; // Fetch admin ID from the request
  try {
    const { username, contact, email, password, role, status } = req.body;

    // Check if the company email already exists
    const existingCompany = await Company.findOne({ $or: [{ email }, { username }] });
    if (existingCompany) {
      return res
        .status(400)
        .json({ message: "Company with this username or email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new company
    const newCompany = new Company({ username, contact, email, password: hashedPassword, role , status});
    await newCompany.save();

    // Log action in admin history
    await adminhistory.create({ adminid, action: `New company created with ID: ${newCompany._id}` });

    res
      .status(201)
      .json({ message: "Company created successfully.", company: newCompany });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Company login
exports.companyLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const company = await Company.findOne({ username });
    if (!company || company.password !== password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: company._id, role: company.role }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    res
      .status(200)
      .json({ message: "Login successful.", token: `Bearer ${token}` });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({ companies });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Get a single company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    res.status(200).json({ company });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Update a company by ID
exports.updateCompany = async (req, res) => {
  const adminid = req.adminid; // Fetch admin ID from the request
  try {
    const updates = req.body;

    // Hash the password if it is being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    // Log action in admin history
    await adminhistory.create({
      adminid,
      action: `Company updated with ID: ${company._id}`,
    });

    res.status(200).json({ message: "Company updated successfully.", company });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Delete a company by ID
exports.deleteCompany = async (req, res) => {
  const adminid = req.adminid; // Fetch admin ID from the request
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    // Log action in admin history
    await adminhistory.create({
      adminid,
      action: `Company deleted with ID: ${company._id}`,
    });

    res.status(200).json({ message: "Company deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
