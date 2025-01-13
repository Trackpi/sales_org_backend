const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // 10-digit phone number validation
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  designation: {
    type: String,
    required: true,
    enum: ["Executive", "Manager"], 
  },
  password: {
    type: String,
    required: true,
  },
  permissionType: {
    type: String,
    required: true,
    enum: ["Executive", "Manager"],
  },
  bankDetails: {
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    ifscCode: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  documents: {
    businessCard: {
      type: String, 
      required: true,
    },
    employeeIdCard: {
      type: String, 
      required: true,
    },
    offerLetter: {
      type: String, 
      required: true,
    },
    nda: {
      type: String, 
      required: true,
    },
    nsa: {
      type: String, 
      required: true,
    },
  },
  teamId:{
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
