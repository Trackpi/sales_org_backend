const Employee = require('../models/employeeModel');
const bcrypt = require('bcrypt');

// Create a new employee
exports.createEmployee = async (req, res) => {
    try {
        const { username, email, empId, phone, accNo, ifc, bank, branch, role, password } = req.body;

        

        // Validate empId
        if (!empId || empId.trim() === "") {
            return res.status(400).json({ message: "Employee ID is required and cannot be empty." });
        }

        // Check for duplicate email or employee ID
        const existingEmployee = await Employee.findOne({ $or: [{ email }, { empId }] });
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee with this email or ID already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new employee
        const newEmployee = new Employee({
            username,
            email,
            empId,
            phone,
            accNo,
            ifc,
            bank,
            branch,
            role,
            password: hashedPassword,
        });

        await newEmployee.save();

        res.status(201).json({ message: "Employee created successfully.", employee: newEmployee });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};


// Get all employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Get a single employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Update an employee by ID
exports.updateEmployee = async (req, res) => {
    try {
        const updates = req.body;

        // Hash the password if it's being updated
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const employee = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }
        res.status(200).json({ message: "Employee updated successfully.", employee });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }
        res.status(200).json({ message: "Employee deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
