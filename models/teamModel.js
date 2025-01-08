const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Team names must be unique
  },
  description: {
    type: String,
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // References the Employee model for the manager
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee', // References Employee model
    },
  ],
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
