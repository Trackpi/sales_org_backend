const Team = require('../models/teamModel');
const Employee = require('../models/employeeModel');
const adminhistory = require('../models/adminPanelHistory'); 

// Get all teams
// Fetches all teams from the database and populates manager and member details.
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
    .populate("manager", "fullName")
    .populate("members.employeeId", "fullName");
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new team
// Validates input, ensures unique team name, assigns a manager, and creates a new team.
exports.addTeam = async (req, res) => {
  const adminid = req.adminid; // Fetch admin ID from the request
  try {
    const { teamName, manager, teamColor } = req.body;
    const startingDate = new Date();

 // Check if the team name is unique.
 const existingTeam = await Team.findOne({ teamName });
 if (existingTeam) {
   return res.status(400).json({ error: "A team with this name already exists. Please choose a different name." });
 }

 // Ensure the selected manager exists and is not assigned to another team.
    const managerExists = await Employee.findById(manager);
    if (!managerExists) {
      return res.status(404).json({ error: "Manager not found" });
    }
    if (managerExists.teamId) {
      return res.status(400).json({ error: "Manager is already assigned to another team." });
    }
   
    // Create the team and assign the manager.
    const team = new Team({ teamName, startingDate, manager, members });
    await team.save();

    managerExists.teamId = team._id;
    await managerExists.save();

    for (const member of members) {
      const employee = await Employee.findById(member.employeeId);
      if (!employee) {
        return res.status(404).json({ error: `Employee with ID ${member.employeeId} not found` });
      }
      if (employee.teamId && employee.teamId !== String(team._id)) {
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
// Fetches details of a specific team by its ID and populates manager and member information.
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
    .populate("manager")
    .populate("members.employeeId");
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View team details (including team members)
// Similar to getTeamById, this fetches and displays team details.
exports.viewTeamDetails = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("manager").populate("members.employeeId");
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update team
// Allows updating team name, manager, team color, and members while ensuring all constraints.
exports.updateTeam = async (req, res) => {
  const adminid = req.adminid; // Get admin ID for logging.
  try {
    const { teamName, manager, teamColor, members } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Update manager if provided and different from the current one.
    if (manager && manager !== String(team.manager)) {
      const newManager = await Employee.findById(manager);
      if (!newManager) {
        return res.status(404).json({ error: "New manager not found" });
      }
      if (newManager.teamId) {
        return res.status(400).json({ error: "The selected manager is already assigned to another team." });
      }

      // Remove current manager from the team.
      const oldManager = await Employee.findById(team.manager);
      if (oldManager) {
        oldManager.teamId = null;
        await oldManager.save();
      }

      // Assign new manager to the team.
      newManager.teamId = team._id;
      await newManager.save();
      team.manager = manager;
    }

    // Update team details.
    team.teamName = teamName || team.teamName;
    team.teamColor = teamColor || team.teamColor;

    // Update team members.
    if (members) {
      const updatedMembers = [];
      for (const member of members) {
        const employee = await Employee.findById(member.employeeId);
        if (!employee) {
          return res.status(404).json({ error: `Employee with ID ${member.employeeId} not found` });
        }
        if (employee.teamId && employee.teamId !== String(team._id)) {
          return res.status(400).json({ error: `Employee ${employee.name} is already assigned to another team.` });
        }
        employee.teamId = team._id;
        await employee.save();
        updatedMembers.push({ employeeId: employee._id, name: employee.name, status: member.status });
      }
      team.members = updatedMembers;
      team.teamCount = updatedMembers.length;
    }

    await team.save();

// exports.updateTeam = async (req, res) => {
//   const adminid = req.adminid; // Fetch admin ID from the request
//   try {
//     const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     if (!updatedTeam) {
//       return res.status(404).json({ error: "Team not found" });
//     }

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
// Removes a team and unassigns its manager and members.
exports.deleteTeam = async (req, res) => {
  const adminid = req.adminid; // Fetch admin ID from the request
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    
    // Unassign the manager.
    const manager = await Employee.findById(team.manager);
    if (manager) {
      manager.teamId = null;
      await manager.save();
    }

    // Unassign all members.
    for (const member of team.members) {
      const employee = await Employee.findById(member.employeeId);
      if (employee) {
        employee.teamId = null;
        await employee.save();
      }
    }

    // Log Deletion in admin history
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
// Allows adding new members to a team while ensuring they aren't part of another team.
exports.addMembersToTeam = async (req, res) => {
  const adminid = req.adminid; // Fetch admin ID from the request
  try {
    const { teamId, members } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const newMembers = [];
    for (const member of members) {
      const employee = await Employee.findById(member.employeeId);
      if (!employee) {
        return res.status(404).json({ error: `Employee with ID ${member.employeeId} not found` });
      }
      if (employee.teamId && employee.teamId !== String(team._id)) {
        return res.status(400).json({ error: `Employee ${employee.name} is already assigned to another team.` });
      }
      employee.teamId = team._id;
      await employee.save();
      newMembers.push({ employeeId: employee._id, name: employee.name, status: member.status });
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
    const { query } = req.query;
    const teams = await Team.find({ teamName: { $regex: query, $options: 'i' } }).populate("manager", "fullName");
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
