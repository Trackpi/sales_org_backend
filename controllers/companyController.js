const Company = require('../models/companyModel'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');

// Create a new company
exports.createCompany = async (req, res) => {
    try {
        const { username, contact, email, password } = req.body;

        // Check if the company email already exists
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: "Company with this email already exists." });
        }

        // Create a new company
        const newCompany = new Company({ username, contact, email, password });
        await newCompany.save();

        res.status(201).json({ message: "Company created successfully.", company: newCompany });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Company login
exports.companyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const company = await Company.findOne({ email });
        if (!company || company.password !== password) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: company._id }, process.env.JWT_KEY, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful.", token: `Bearer ${token}` });
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
    try {
        const updates = req.body;
        const company = await Company.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!company) {
            return res.status(404).json({ message: "Company not found." });
        }
        res.status(200).json({ message: "Company updated successfully.", company });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Delete a company by ID
exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).json({ message: "Company not found." });
        }
        res.status(200).json({ message: "Company deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
