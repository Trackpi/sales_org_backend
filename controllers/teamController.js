const Team = require('../models/teamModel');
const Employee = require('../models/employeeModel');
const adminhistory = require('../models/adminPanelHistory'); 

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
  const adminid = req.adminid; // Fetch admin ID from the request
  try {
    const { teamName, manager, members } = req.body;
    const startingDate = new Date();

    const managerExists = await Employee.findById(manager);
    if (!managerExists) {
      return res.status(404).json({ error: "Manager not found" });
    }
    if (managerExists.teamId) {
      return res.status(400).json({ error: "Manager is already assigned to a team" });
    }

    const team = new Team({ teamName, startingDate, manager, members });
    await team.save();

    managerExists.teamId = team._id;
    await managerExists.save();

    for (let member of members) {
      const employee = await Employee.findById(member.employeeId);
      if (!employee) {
        return res.status(404).json({ error: `Employee with ID ${member.employeeId} not found` });
      }
      if (employee.teamId) {
        return res.status(400).json({ error: `Employee ${employee.username} is already assigned to a team` });
      }
      employee.teamId = team._id;
      await employee.save();
    }

    // Log action in admin history
    await adminhistory.create({
      adminid,
      action: `New team created with ID: ${team._id} and name: ${teamName}`
    });

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

// View team details (including team members)
exports.viewTeamDetails = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("members.employeeId");
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  const adminid = req.adminid; // Fetch admin ID from the request
  try {
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Log action in admin history
    await adminhistory.create({
      adminid,
      action: `Team updated with ID: ${updatedTeam._id}`
    });

    res.status(200).json({ message: "Team updated successfully", updatedTeam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  const adminid = req.adminid; // Fetch admin ID from the request
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Log action in admin history
    await adminhistory.create({
      adminid,
      action: `Team deleted with ID: ${team._id}`
    });

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add members to a team
exports.addMembersToTeam = async (req, res) => {
  const adminid = req.adminid; // Fetch admin ID from the request
  try {
    const { teamId, members } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    team.members.push(...members);
    team.teamCount = team.members.length;
    await team.save();

    // Log action in admin history
    await adminhistory.create({
      adminid,
      action: `Members added to team with ID: ${teamId}`
    });

    res.status(200).json({ message: "Members added successfully", team });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a single member to a team
exports.addMemberToTeam = async (req, res) => {
  const adminid = req.adminid; // Fetch admin ID from the request
  const { teamId, empId } = req.body;

  try {
    const team = await Team.findById(teamId);
    const employee = await Employee.findById(empId);

    if (!team || !employee) {
      return res.status(404).json({ error: 'Team or employee not found' });
    }

    if (team.members.includes(empId)) {
      return res.status(400).json({ error: 'Employee already in team' });
    }

    team.members.push(empId);
    employee.teamId = teamId;

    await team.save();
    await employee.save();

    // Log action in admin history
    await adminhistory.create({
      adminid,
      action: `Employee with ID: ${empId} added to team with ID: ${teamId}`
    });

    res.status(200).json({ message: 'Member added successfully', team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search teams by name
exports.searchTeams = async (req, res) => {
  try {
    const { teamName } = req.query;
    const teams = await Team.find({ teamName: { $regex: teamName, $options: 'i' } });
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
