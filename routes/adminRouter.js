const express = require("express");
const verifyJwt = require("../middlewares/jwtMiddleware"); // Import JWT middleware

const adminController = require("../controllers/adminController"); // Adjust the path
const router = express.Router();


router.post("/login", adminController.adminlogin);

router.put("/:id",verifyJwt,adminController.updateAdmin);




module.exports = router;
