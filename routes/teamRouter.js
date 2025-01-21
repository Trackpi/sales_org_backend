const express = require("express");
const teamController = require("../controllers/teamController");
const verifyJwt = require("../middlewares/jwtMiddleware");

const router = express.Router();

// Get all teams
router.get("/",verifyJwt , teamController.getTeams);

// Create a new team
router.post("/",verifyJwt , teamController.addTeam);

// Search for teams
router.get("/search",verifyJwt , teamController.searchTeams);

// Get a single team by ID
router.get("/:id",verifyJwt , teamController.getTeamById);

// View team details by ID
router.get("/:id/details",verifyJwt , teamController.viewTeamDetails);

// Update a team by ID
router.put("/:id",verifyJwt , teamController.updateTeam);

// Delete a team by ID
router.delete("/:id",verifyJwt , teamController.deleteTeam);

// Add members to a team
router.post("/add-members",verifyJwt , teamController.addMembersToTeam);


// Export team data
router.get("/export", verifyJwt, teamController.exportTeams);

// Bulk delete teams
router.post("/bulk-delete", verifyJwt, teamController.bulkDeleteTeams);
//pagination
router.get("/pagination", verifyJwt, teamController.getTeamsWithPagination);

module.exports = router;

