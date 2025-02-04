const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// const userRoutes = require("./routes/userRouter");

const adminRoutes = require("./routes/adminLoginRouter");
require("dotenv").config();
const connectDB = require("./config/connection");
const fs = require("fs");
const path = require("path");
const cron = require('node-cron');
app.use(express.json());
app.use(cors());
const teamRouter = require('./routes/teamRouter');
const employeeRoutes = require('./routes/employeeRouter')
const companyRoutes = require('./routes/companyRouter')
const adminManagementRoutes = require('./routes/adminManagementRoutes');
const productRoutes = require('./routes/productRouter');
const faqRouter = require('./routes/faqRoute');
const productFaqRouter = require('./routes/productFaqRouter');
const { permanentlyDeleteOldUsers } = require('./controllers/employeController');
const { generateArrayPDFForAdminHistoryBackup } = require('./controllers/adminPanelHistory');
connectDB();

app.listen(3001, () => {
  console.log("server is running");
});

// Ensure the uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Creates 'uploads' folder if it doesn't exist
}


app.use('/api/admin',adminRoutes);
app.use('/api/adminmanagement', adminManagementRoutes);
// app.use("/api/users", userRoutes);
app.use('/api/teams', teamRouter);
app.use('/api/employees', employeeRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/companies/queries',faqRouter)
app.use('/api/companies/queries',productFaqRouter)
// Schedule permanent deletion to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled permanent deletion...');
  await permanentlyDeleteOldUsers();
});
console.log('Permanent deletion cron job scheduled.');


app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});


// Schedule admin panel history deletion to run every month 1 2pm
cron.schedule('0 0 1 * * ', async () => {
  console.log('Running scheduled admin panel history deletion...');
  await generateArrayPDFForAdminHistoryBackup();
});
console.log('admin panel history deletion cron job scheduled.');


app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});