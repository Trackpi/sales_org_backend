const Employee = require('../models/employeeModel'); // Adjust the path as necessary

// Create a new employee
exports.createEmployee = async (req, res) => {
    try {
        const { username, email, empId, phone, accNo, ifc, bank, branch, role } = req.body;

        // Check if the employee ID or email already exists
        const existingEmployee = await Employee.findOne({ $or: [{ empId }, { email }] });
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee with this ID or email already exists." });
        }

        // Create a new employee
        const newEmployee = new Employee({ username, email, empId, phone, accNo, ifc, bank, branch, role });
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
        res.status(200).json({ employees });
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
        res.status(200).json({ employee });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Update an employee by ID
exports.updateEmployee = async (req, res) => {
    try {
        const updates = req.body;
        const employee = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true });

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
