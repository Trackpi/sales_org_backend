const express = require('express');
const { createAdmin, getAllAdmins, editAdmin, deleteAdmin } = require('../controllers/adminManagementController');
const verifyJwt = require('../middlewares/jwtMiddleware');
const upload = require('../middlewares/multer'); // Import multer middleware

const router = express.Router();

// Route to add an admin with profile picture upload
router.post('/add', verifyJwt, upload.single('profilePic'), createAdmin);

// Route to fetch all admins
router.get('/', verifyJwt, getAllAdmins);

// Route to edit an admin with profile picture upload
router.put('/:username', verifyJwt, upload.single('profilePic'), editAdmin);

// Route to delete an admin
router.delete('/:username', verifyJwt, deleteAdmin);

module.exports = router;
