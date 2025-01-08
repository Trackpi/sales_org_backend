const express = require('express');
const teamController = require('../controllers/teamController');

const router = express.Router();

// Create a new team
router.post('/', teamController.createTeam);

// Add a member to a team
router.post('/add-member', teamController.addMemberToTeam);

// Remove a member from a team
router.post('/remove-member', teamController.removeMemberFromTeam);

// Get all members of a team
router.get('/:teamId/members', teamController.getTeamMembers);

module.exports = router;
