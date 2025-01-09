const mongoose = require("mongoose");

const adminHisSchema = new mongoose.Schema(
  {
    adminid: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const adminHisModel = mongoose.model("AdminHistory", adminHisSchema);

module.exports = adminHisModel;
