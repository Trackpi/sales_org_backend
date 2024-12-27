const express = require("express")
const mongoose= require('mongoose')
const cors = require('cors')
const app =express()
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