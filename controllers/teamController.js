const Team = require('../models/teamModel');
const Employee = require('../models/employeeModel');
const adminhistory = require('../models/adminPanelHistory'); 

// Get all teams
// Fetches all teams from the database and populates manager and member details.
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
    .populate("manager", "username")
    .populate("members.employeeId", "username");
    res.status(200).json({
      success: true,
      message: "Teams retrieved successfully",
      data: teams,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new team
// Validates input, ensures unique team name, assigns a manager, and creates a new team.
exports.addTeam = async (req, res) => {
  const adminid = req.adminid; // Fetch admin ID from the request
  try {
    const { teamName,empID, teamColor} = req.body;
    console.log('Team Name:', teamName);
    console.log('Employee ID:', empID);
    console.log('Team Color:', teamColor);
    const startingDate = new Date();

 // Validate required fields
 if (!teamName || teamName.trim() === "") {
  return res.status(400).json({ error: "Team name cannot be empty." });
}
if (!empID) {
  return res.status(400).json({ error: "Employee ID is required for the manager." });
}
if (!teamColor) {
  return res.status(400).json({ error: "Team color is required." });
}

 // Check if the team name is unique.
 const existingTeam = await Team.findOne({ teamName });
 if (existingTeam) {
   return res.status(400).json({ error: "A team with this name already exists. Please choose a different name." });
 }

 // Ensure the selected manager exists and is not assigned to another team.
    const manager = await Employee.findOne({ empID });
    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }
    if (manager.teamId) {
      return res.status(400).json({ error: "Manager is already assigned to another team." });
    }
  
    // Create the team and assign the manager.
    const team = new Team({
      teamName,
      teamColor,
      startingDate: new Date(),
      manager: manager._id,
      
    });
    await team.save();

    manager.teamId = team._id;
    await manager.save();


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
    .populate("manager","username")
    .populate("members.employeeId","username");
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.status(200).json({
      success: true,
      message: "Team retrieved successfully",
      data: team,
    });
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
 
    // Update fields
    team.teamName = teamName || team.teamName;
    team.teamColor = teamColor || team.teamColor;

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


    if (members) {
      const currentMemberIds = members.map((member) => member.employeeId);
      const removedMembers = team.members.filter(
        (member) => !currentMemberIds.includes(String(member.employeeId))
      );

      await Promise.all(
        removedMembers.map(async (member) => {
          const employee = await Employee.findById(member.employeeId);
          if (employee) {
            employee.teamId = null;
            await employee.save();
          }
        })
      );

      const updatedMembers = await Promise.all(
        members.map(async (member) => {
          const employee = await Employee.findById(member.employeeId);
          if (!employee) {
            throw new Error(`Employee with ID ${member.employeeId} not found`);
          }
          if (employee.teamId && employee.teamId !== String(team._id)) {
            throw new Error(`Employee ${employee.username} is already assigned to another team`);
          }
          employee.teamId = team._id;
          await employee.save();
          return { employeeId: employee._id, name: employee.username, status: member.status };
        })
      );

      team.members = updatedMembers;
      team.teamCount = updatedMembers.length;
    }

    await team.save();

    // Log action in admin history
    await adminhistory.create({
      adminid,
      action: `Team updated with ID: ${team._id}`
    });

    res.status(200).json({ message: "Team updated successfully", team });
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
    await Promise.all(
      team.members.map(async (member) => {
        const employee = await Employee.findById(member.employeeId);
        if (employee) {
          employee.teamId = null;
          await employee.save();
        }
      })
    );

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

    team.members.push(...newMembers);
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
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }
    console.log("Search query:", query); 
    const teams = await Team.find({ 
      teamName: { $regex: query, $options: 'i' } 
    }).populate("manager", "fullName");

    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Export Team Data
exports.exportTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("manager", "username")
      .populate("members.employeeId", "username");

    const csvData = teams.map((team) => ({
      TeamName: team.teamName,
      TeamColor: team.teamColor,
      Manager: team.manager?.username || "N/A",
      Members: team.members.map((member) => member.employeeId?.username).join(", ") || "N/A",
    }));

   // Add headers to the CSV
   const headers = ["TeamName", "TeamColor", "Manager", "Members"];
   const csvRows = [headers.join(",")];  // Create the header row

   // Add data rows
   csvData.forEach((row) => {
     csvRows.push(Object.values(row).join(","));
   });

   // Convert array to CSV string
   const csv = csvRows.join("\n");

   // Set response headers and send the CSV
   res.header("Content-Type", "text/csv");
   res.attachment("teams.csv");
   res.status(200).send(csv);
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
};

//Bulk Delete Teams
exports.bulkDeleteTeams = async (req, res) => {
  const adminid = req.adminid; // Fetch admin ID from the request
  try {
    const { teamIds } = req.body;
    if (!teamIds || teamIds.length === 0) {
      return res.status(400).json({ error: "No team IDs provided" });
    }

    const deletedTeams = await Team.find({ _id: { $in: teamIds } });
    const managerIds = deletedTeams.map((team) => team.manager);
    const memberIds = deletedTeams.flatMap((team) => team.members.map((m) => m.employeeId));

    // Unassign managers and members
    await Employee.updateMany(
      { _id: { $in: [...managerIds, ...memberIds] } },
      { $set: { teamId: null } }
    );

    const result = await Team.deleteMany({ _id: { $in: teamIds } });

    // Log action in admin history
    await adminhistory.create({
      adminid,
      action: `Teams deleted with IDs: ${teamIds.join(", ")}`,
    });
  // Check if any teams were deleted
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "No teams found to delete" });
  }
    res.status(200).json({ message: "Teams deleted successfully",deletedTeams: deletedTeams });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Pagination & Filtering
exports.getTeamsWithPagination = async (req, res) => {
  const { page = 1, limit = 10, search = "", sortBy = "teamName", sortOrder = "asc", startDate, endDate, managerId } = req.query;

  try {
    // Base query for filtering
    const query = {};

    // Add search filter for teamName
    if (search) {
      query.teamName = { $regex: search, $options: "i" };
    }

    // Add date range filter (if startDate and endDate are provided)
    if (startDate && endDate) {
      query.startingDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Filter by manager ID (if provided)
    if (managerId) {
      query.manager = managerId;
    }

    // Sorting logic
    const sortCriteria = {};
    sortCriteria[sortBy] = sortOrder === "desc" ? -1 : 1; // Sorting order based on the user input

    // Fetch the teams with pagination and sorting
    const teams = await Team.find(query)
      .populate("manager", "username")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort(sortCriteria);  // Sorting applied here

    const totalTeams = await Team.countDocuments(query);

    // Sending response with pagination data
    res.status(200).json({
      success: true,
      data: teams,
      pagination: {
        totalTeams,
        totalPages: Math.ceil(totalTeams / limit),
        currentPage: page,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
