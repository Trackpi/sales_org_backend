const express = require('express');
const {
  createAdmin,
  getAllAdmins,
  editAdmin,
  deleteAdmin,
  searchAdmins,
} = require('../controllers/adminManagementController');
const verifyJwt = require('../middlewares/jwtMiddleware');

const router = express.Router();

router.post('/add', verifyJwt, createAdmin);
router.get('/', verifyJwt, getAllAdmins);
router.put('/:username', verifyJwt, editAdmin);
router.delete('/:username', verifyJwt, deleteAdmin);
router.get('/search', verifyJwt, searchAdmins); // Ensure this route exists

module.exports = router;

