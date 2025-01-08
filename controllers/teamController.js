const Team = require('../models/teamModel');

// Get all teams
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new team
exports.addTeam = async (req, res) => {
  try {
    const { teamName, startingDate, managerName, teamCount, members } = req.body;
    const team = new Team({ teamName, startingDate, managerName, teamCount, members });
    await team.save();
    res.status(201).json({ message: "Team created successfully", team });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Team updated successfully", updatedTeam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Add members to a team
exports.addMembersToTeam = async (req, res) => {
  try {
    const { teamId, members } = req.body; // teamId and members array should be passed in the request body

    // Find the team by ID
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Add members to the team
    team.members.push(...members);
    team.teamCount = team.members.length; // Update the team count
    await team.save();

    res.status(200).json({ message: "Members added successfully", team });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
