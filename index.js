const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const adminRoutes = require("./routes/adminLoginRouter");
const employeeRoutes = require('./routes/employeeRouter')
require("dotenv").config();
const connectDB = require("./config/connection");
const fs = require("fs");
const path = require("path");
app.use(express.json());
app.use(cors());

connectDB();

app.listen(3001, () => {
  console.log("server is running");
});

// Ensure the uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Creates 'uploads' folder if it doesn't exist
}
app.use(adminRoutes);
app.use("/api/admin/employees", employeeRoutes);


app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});
