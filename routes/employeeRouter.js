const express = require('express');
const employeeController = require('../controllers/employeController');
const verifyJwt = require('../middlewares/jwtMiddleware');

const router = express.Router();


// Create a new employee
router.post('/',verifyJwt, employeeController.createEmployee);

// Get all employees
router.get('/',verifyJwt , employeeController.getAllEmployees);

// Get a single employee by ID
router.get('/:id',verifyJwt , employeeController.getEmployeeById);

// Update an employee by ID
router.put('/:id',verifyJwt , employeeController.updateEmployee);

// Delete an employee by ID
router.delete('/:id',verifyJwt , employeeController.deleteEmployee);

// Soft Delete an employee by ID
router.delete('/soft/:id',verifyJwt , employeeController.SoftDeletion);
//restore trashed users 
router.delete('/softRestore/:id',verifyJwt , employeeController.restoreUser);

module.exports = router;



