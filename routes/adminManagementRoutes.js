const express = require('express');
const { createAdmin, getAllAdmins, editAdmin, deleteAdmin } = require('../controllers/adminManagementController');

const router = express.Router();

// Route to add an admin
router.post('/add', createAdmin);

// Route to fetch all admins
router.get('/', getAllAdmins);

// Route to edit an admin
router.put('/:username', editAdmin);

// Route to delete an admin
router.delete('/:username', deleteAdmin);

module.exports = router;
