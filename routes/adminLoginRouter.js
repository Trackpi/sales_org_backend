const express = require("express");

const adminController = require("../controllers/adminLogin"); 
const router = express.Router();


router.post("/Adminlogin", adminController.adminlogin);



module.exports = router;