const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');

// Routes Define
router.get('/', clubController.getAllClubs);
router.post('/add', clubController.createClub);
router.post('/add-member', clubController.addMember); 
router.get('/my-joined-clubs', clubController.getMyJoinedClubs);
router.get('/notifications', clubController.getNotifications);
router.put('/notifications/:id', clubController.markNotificationAsRead);

module.exports = router;