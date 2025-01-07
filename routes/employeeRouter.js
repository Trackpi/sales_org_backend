const express = require('express');
const employeeController = require('../controllers/employeController'); 

const router = express.Router();

// Create a new employee
router.post('/', employeeController.createEmployee);

// Get all employees
router.get('/', employeeController.getAllEmployees);

// Get a single employee by ID
router.get('/:id', employeeController.getEmployeeById);

// Update an employee by ID
router.put('/:id', employeeController.updateEmployee);

// Delete an employee by ID
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
