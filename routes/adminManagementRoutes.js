const express = require('express');
const { createAdmin, getAllAdmins, deleteAdmin } = require('../controllers/adminManagementController');

const router = express.Router();

// Route to add an admin
router.post('/add', createAdmin);

// Route to fetch all admins
router.get('/', getAllAdmins);

// Route to delete an admin
router.delete('/:username', deleteAdmin);

module.exports = router;
