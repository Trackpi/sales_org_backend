const Employee = require("../models/employeeModel");
const bcrypt = require("bcrypt");

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      username,
      empID,
      email,
      phoneNumber,
      designation,
      password,
      permissionType,
      bankDetails,
      teamId,
    } = req.body;

    console.log("Request Body:", req.body);

    // Check for missing fields
    if (!username || !email || !phoneNumber || !designation || !password) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Validate empID or generate one
    const generatedEmpID = empID || `EMP${Date.now()}`;

    // Check if empID or email already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ empID: generatedEmpID }, { email }],
    });

    if (existingEmployee) {
      return res.status(400).json({ message: "Employee ID or email already exists." });
    }

    // Check for required files
    const files = req.files;
    if (
      !files ||
      !files.businessCard ||
      !files.employeeIdCard ||
      !files.offerLetter ||
      !files.nda ||
      !files.nsa
    ) {
      return res.status(400).json({ message: "All required documents must be uploaded." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the employee object
    const newEmployee = new Employee({
      username,
      empID: generatedEmpID,
      email,
      phoneNumber,
      designation,
      password: hashedPassword,
      permissionType,
      bankDetails: JSON.parse(bankDetails),
      documents: {
        businessCard: files.businessCard[0].path,
        employeeIdCard: files.employeeIdCard[0].path,
        offerLetter: files.offerLetter[0].path,
        nda: files.nda[0].path,
        nsa: files.nsa[0].path,
      },
      teamId,
    });

    await newEmployee.save();
    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate key error. Ensure unique fields are not repeated.",
        field: Object.keys(error.keyPattern)[0],
      });
    }
    res.status(500).json({ message: "Error creating employee", error: error.message });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employees", error: error.message });
  }
};

// Get an employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employee", error: error.message });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res
      .status(200)
      .json({
        message: "Employee updated successfully",
        employee: updatedEmployee,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating employee", error: error.message });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting employee", error: error.message });
  }
};

// soft delete setup
exports.SoftDeletion = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Employee.findByIdAndUpdate(
      { _id: id },
      { deletedAt: new Date() },
      { new: true }
    );
    return res.status(200).json(result.matchedCount > 0);
  } catch (error) {
    throw new Error("Error during soft deletion: " + error.message);
  }
};

// restore user from trasj
exports.restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Employee.findByIdAndUpdate(
      id,
      { deletedAt: null },
      { new: true }
    );
    return res.status(200).json(result.matchedCount > 0);
  } catch (error) {
    throw new Error("Error during restore: " + error.message);
  }
};

// Get trashed users
exports.getTrashedUsers = async () => {
  try {
    const trashedusers = await Employee.find({ deletedAt: { $ne: null } });
    return res.status(200).json(trashedusers);
  } catch (error) {
    throw new Error("Error fetching trashed users: " + error.message);
  }
};

// perment delete soft deleted user after 30 days
exports.permanentlyDeleteOldUsers = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setMinutes(thirtyDaysAgo.getMinutes() - 1);

    const result = await Employee.deleteMany({
      deletedAt: { $lte: thirtyDaysAgo },
    });
    console.log(`${result.deletedCount} users permanently deleted.`);
  } catch (error) {
    console.error("Error during permanent deletion: " + error.message);
  }
};
