const express = require("express");
const teamController = require("../controllers/teamController");

const router = express.Router();

// Get all teams
router.get("/", teamController.getTeams);

// Create a new team
router.post("/", teamController.addTeam);

// Get a single team by ID
router.get("/:id", teamController.getTeamById);

// View team details by ID
router.get("/:id/details", teamController.viewTeamDetails);

// Update a team by ID
router.put("/:id", teamController.updateTeam);

// Delete a team by ID
router.delete("/:id", teamController.deleteTeam);

// Add members to a team
router.post("/add-members", teamController.addMembersToTeam);

// Search for teams
router.get("/search", teamController.searchTeams);


module.exports = router;

