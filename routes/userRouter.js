const express = require('express');
const router = express.Router();
const multer = require("../middlewares/multer"); 

const { addUser, editUser, deleteUser, getUser, getAllUsers, loginUser } = require('../controllers/userController');

// Add a new user
router.post('/add', multer.single("image"), addUser);

// Edit an existing user by ID
router.put('/edit/:userId',multer.single("image"), editUser);

// Delete a user by ID
router.delete('/delete/:userId', deleteUser);

// Get a user by ID
router.get('/get/:userId', getUser);

// Get all users
router.get('/get-all', getAllUsers);

//login user
router.post('/login', loginUser);

module.exports = router;
