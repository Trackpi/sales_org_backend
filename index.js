const express = require("express")
const mongoose= require('mongoose')
const cors = require('cors')
const app =express()
const userRoutes=require('./routes/userRouter')
require("dotenv").config();
const connectDB = require("./config/connection");
const fs = require("fs");
const path = require("path");
app.use(express.json())
app.use(cors())


connectDB();

app.listen(3001,()=>{
    console.log("server is running");
})

// Ensure the uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Creates 'uploads' folder if it doesn't exist
}

app.use('/api/users', userRoutes);