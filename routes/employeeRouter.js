const express = require("express");
const verifyjwt = require('../middlewares/jwtMiddleware')
const upload = require('../middlewares/multer')

const router = express.Router();
const employeeController = require("../controllers/employeController");


// Multer configuration for file uploads
const uploadFields = upload.fields([
    { name: "businessCard", maxCount: 1 },
    { name: "employeeIdCard", maxCount: 1 },
    { name: "offerLetter", maxCount: 1 },
    { name: "nda", maxCount: 1 },
    { name: "nsa", maxCount: 1 },
  ]);
  

// Routes
router.post("/employees",verifyjwt,uploadFields, employeeController.createEmployee); 
router.get("/employees",verifyjwt, employeeController.getAllEmployees); 
router.get("/employees/:id",verifyjwt, employeeController.getEmployeeById); 
router.put("/employees/:id",verifyjwt, employeeController.updateEmployee); 
router.delete("/employees/:id",verifyjwt, employeeController.deleteEmployee); 

// Soft Delete an employee by ID
router.delete('/soft/:id',verifyjwt , employeeController.SoftDeletion);
//restore trashed users 
router.delete('/softRestore/:id',verifyjwt , employeeController.restoreUser);

module.exports = router;
