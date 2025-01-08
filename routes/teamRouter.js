const express = require("express");
const router = express.Router();
const {
  getTeams,
  addTeam,
  getTeamById,
  updateTeam,
  deleteTeam,
  addMembersToTeam,
} = require("../controllers/teamController");

// Routes
router.get("/", getTeams);
router.post("/", addTeam);
router.get("/:id", getTeamById);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);
router.post("/add-members", addMembersToTeam);

module.exports = router;
