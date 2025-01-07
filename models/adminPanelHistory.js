const mongoose = require("mongoose");

const adminHisSchema = new mongoose.Schema({
  adminid: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default:Date.now()
  }
});

const adminHisModel = new mongoose.model("admins", adminHisSchema);

module.exports = adminHisModel;
