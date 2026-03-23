const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// participate in event route
router.post('/participate', eventController.participateInEvent);

router.post('/add', eventController.createEvent); // add new event route
router.get('/', eventController.getAllEvents);    // get all events route

module.exports = router;