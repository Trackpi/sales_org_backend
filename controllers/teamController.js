const Team = require('../models/teamModel');
const Employee = require('../models/employeeModel'); 

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
    const { teamName, manager, members } = req.body; 
    const startingDate = new Date(); 

    // Ensure the manager exists and is not already associated with another team
    const managerExists = await Employee.findById(manager); // Finding the manager by their ID
    if (!managerExists) {
      return res.status(404).json({ error: "Manager not found" }); // If manager doesn't exist, return error
    }
    if (managerExists.teamId) {
      return res.status(400).json({ error: "Manager is already assigned to a team" }); // Ensure the manager is not already assigned to a team
    }

    // Create the team
    const team = new Team({ teamName, startingDate, manager, members });
    await team.save(); // Saving the new team in the database

    // Update the manager's teamId field
    managerExists.teamId = team._id; // Associate the manager with the new team
    await managerExists.save(); // Save the updated manager details in the database

    // Update the team members' teamId field and prevent adding duplicates
    for (let member of members) {
      const employee = await Employee.findById(member.employeeId); // Find each employee by their ID
      if (!employee) {
        return res.status(404).json({ error: `Employee with ID ${member.employeeId} not found` }); // If employee doesn't exist, return error
      }
      if (employee.teamId) {
        return res.status(400).json({ error: `Employee ${employee.username} is already assigned to a team` }); // Ensure the employee is not already assigned to another team
      }
      employee.teamId = team._id; // Update the employee's teamId field to associate them with the team
      await employee.save(); // Save the updated employee details in the database
    }

    res.status(201).json({ message: "Team created successfully", team }); // Respond with success and the created team details
  } catch (err) {
    res.status(500).json({ error: err.message }); // If any error occurs, send the error message
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
  } 
catch (err) {
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

exports.addMemberToTeam = async (req, res) => {
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

  