const express = require("express");
const verifyJwt = require("../middlewares/jwtMiddleware"); // Import JWT middleware

const adminController = require("../controllers/adminController"); // Adjust the path
const router = express.Router();




// Route for logging in as admin
router.post("/login", adminController.adminlogin);


// Route for updating an admin by ID
router.put("/:id",verifyJwt,adminController.updateAdmin);




module.exports = router;
