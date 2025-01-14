const mongoose = require("mongoose");
const { ref } = require("pdfkit");

const adminHisSchema = new mongoose.Schema(
  {
    adminid: {
      type: String,
      ref:'Admin',
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
