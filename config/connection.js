
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = () => {
  const databaseUrl = process.env.CONNECTION_STRING;
  console.log('MongoDB URI:', databaseUrl); 

  mongoose.connect(databaseUrl)  
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch(error => {
      console.error('Error connecting to MongoDB:', error.message);
      process.exit(1); 
    });
};

module.exports = connectDB

