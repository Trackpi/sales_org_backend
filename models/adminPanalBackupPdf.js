const mongoose = require("mongoose");

const adminHisBackupSchema = new mongoose.Schema(
  {
    pdf: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const adminHisBackupModel = mongoose.model("AdminHistoryBackupPdf", adminHisBackupSchema);

module.exports = adminHisBackupModel;
