const express = require("express");
const verifyJwt = require("../middlewares/jwtMiddleware"); 

const adminController = require("../controllers/adminLogin"); 
const router = express.Router();


router.post("/login", adminController.adminlogin);

router.put("/:id",verifyJwt,adminController.updateAdmin);




module.exports = router;
