const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  startingDate: { type: Date, required: true },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Reference to an employee as the manager
    required: true, 
    unique: true, //  One manager cannot manage multiple teams
  },
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

