const Employee = require('../models/employeeModel');
const adminhistory = require('../models/adminPanelHistory');
const bcrypt = require('bcrypt');

// Create a new employee
exports.createEmployee = async (req, res) => {
    const adminid = req.adminid; // Fetch admin ID from the request
    try {
        const { username, email, empId, phone, accNo, ifc, bank, branch, role, password, designation , teamId, buisnessCard,
            empIdCard, offerletter, address, location, bloodGrp, dob, city, pin
        } = req.body;

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
            designation,
            teamId, buisnessCard,
            empIdCard, offerletter, address, location, bloodGrp, dob, city, pin
        });

        await newEmployee.save();

        // Log action in admin history
        await adminhistory.create({
            adminid,
            action: `New employee created with ID: ${newEmployee._id}`
        });

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
    const adminid = req.adminid; // Fetch admin ID from the request
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

        // Log action in admin history
        await adminhistory.create({
            adminid,
            action: `Employee updated with ID: ${employee._id}`
        });

        res.status(200).json({ message: "Employee updated successfully.", employee });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
    const adminid = req.adminid; // Fetch admin ID from the request
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        // Log action in admin history
        await adminhistory.create({
            adminid,
            action: `Employee deleted with ID: ${employee._id}`
        });

        res.status(200).json({ message: "Employee deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};


// soft delete setup
exports.SoftDeletion = async (req,res) => {
    try {
        const {id}=req.params
        const result = await Employee.findByIdAndUpdate(
        {_id:id},
        { deletedAt: new Date() },
        { new: true }
        );
        return res.status(200).json(result.matchedCount > 0);
      } catch (error) {
        throw new Error('Error during soft deletion: ' + error.message);
      }
    
   
};
  
// restore user from trasj
  exports.restoreUser = async (req,res) => {
    try {
        const {id}=req.params
        const result = await Employee.findByIdAndUpdate(
          id,
          { deletedAt: null },
          { new: true }
        );
        return res.status(200).json(result.matchedCount > 0);        ;
      } catch (error) {
        throw new Error('Error during restore: ' + error.message);
      }
};

// Get trashed users
exports.getTrashedUsers = async () => {
    try {
     const trashedusers= await Employee.find({ deletedAt: { $ne: null } });
    return  res.status(200).json(trashedusers)
    } catch (error) {
      throw new Error('Error fetching trashed users: ' + error.message);
    }
  };


  // perment delete soft deleted user after 30 days 
exports.permanentlyDeleteOldUsers = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setMinutes(thirtyDaysAgo.getMinutes() - 1);
  
      const result = await Employee.deleteMany({
        deletedAt: { $lte: thirtyDaysAgo }
      });
      console.log(`${result.deletedCount} users permanently deleted.`);
    } catch (error) {
      console.error('Error during permanent deletion: ' + error.message);
    }
  };