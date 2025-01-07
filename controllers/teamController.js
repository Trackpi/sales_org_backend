const Team = require('../models/teamModel');
const Employee = require('../models/employeeModel');

const createTeam = async (req, res) => {
  const { name, description, managerId } = req.body;

  try {
    const manager = await Employee.findById(managerId);
    if (!manager || manager.role !== 'Manager') {
      return res.status(400).json({ error: 'Invalid manager ID' });
    }

    const newTeam = new Team({ name, description, managerId });
    await newTeam.save();

    res.status(201).json({ message: 'Team created successfully', team: newTeam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//Add Member to Team

const addMemberToTeam = async (req, res) => {
    const { teamId, employeeId } = req.body;
  
    try {
      const team = await Team.findById(teamId);
      const employee = await Employee.findById(employeeId);
  
      if (!team || !employee) {
        return res.status(404).json({ error: 'Team or employee not found' });
      }
  
      if (team.members.includes(employeeId)) {
        return res.status(400).json({ error: 'Employee already in team' });
      }
  
      team.members.push(employeeId);
      employee.teamId = teamId;
  
      await team.save();
      await employee.save();
  
      res.status(200).json({ message: 'Member added successfully', team });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //Remove Member from Team
  const removeMemberFromTeam = async (req, res) => {
    const { teamId, employeeId } = req.body;
  
    try {
      const team = await Team.findById(teamId);
      const employee = await Employee.findById(employeeId);
  
      if (!team || !employee) {
        return res.status(404).json({ error: 'Team or employee not found' });
      }
  
      team.members = team.members.filter((id) => id.toString() !== employeeId);
      employee.teamId = null;
  
      await team.save();
      await employee.save();
  
      res.status(200).json({ message: 'Member removed successfully', team });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
//Get All Employees in a Team
const getTeamMembers = async (req, res) => {
    const { teamId } = req.params;
  
    try {
      const team = await Team.findById(teamId).populate('members', 'username email role');
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
  
      res.status(200).json({ members: team.members });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  