const express = require('express');
const { createAdmin, getAllAdmins, editAdmin, deleteAdmin } = require('../controllers/adminManagementController');
const verifyJwt = require('../middlewares/jwtMiddleware');

const router = express.Router();

// Route to add an admin
router.post('/add',verifyJwt, createAdmin);

// Route to fetch all admins
router.get('/',verifyJwt, getAllAdmins);

// Route to edit an admin
router.put('/:username',verifyJwt, editAdmin);

// Route to delete an admin
router.delete('/:username',verifyJwt, deleteAdmin);

module.exports = router;
