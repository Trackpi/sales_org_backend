const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController'); 
const verifyJwt = require('../middlewares/jwtMiddleware'); // Add JWT middleware if required

// Create a new company
router.post('/', companyController.createCompany);

// Company login
router.post('/login', companyController.companyLogin);

// Get all companies
router.get('/', verifyJwt, companyController.getAllCompanies);

// Get a single company by ID
router.get('/:id', verifyJwt, companyController.getCompanyById);

// Update a company by ID
router.put('/:id', verifyJwt, companyController.updateCompany);

// Delete a company by ID
router.delete('/:id', verifyJwt, companyController.deleteCompany);

module.exports = router;
