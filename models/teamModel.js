const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  startingDate: { type: Date, required: true },
  managerName: { type: String, required: true },
  teamCount: { type: Number, default: 0 },
  members: [
    {
      employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
      name: { type: String, required: true },
      status: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Team", TeamSchema);
