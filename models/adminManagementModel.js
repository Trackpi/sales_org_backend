const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['superadmin', 'admin'], // Define possible roles
    default: 'admin',
  },
  profilePic: {
    type: String, // URL or file path to the profile picture
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
