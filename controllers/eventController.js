const Event = require('../models/Event');
const Participant = require('../models/Participant');
const Notification = require('../models/Notification');
const Club = require('../models/Club');


exports.createEvent = async (req, res) => {
    try {
        const { name, date, clubId } = req.body;
        
        // 1. Event create 
        const newEvent = await Event.create({ name, date, clubId });

        // 2. Club details fetch  notification 
        const clubDetails = await Club.findById(clubId);
        const clubName = clubDetails ? clubDetails.name : "a Club";

        // 3. Notification create 
        await Notification.create({
            recipientRole: 'student',
            message: `📅 New Event: "${name}" has been added in ${clubName}. Register now!`
        });

        res.status(201).json(newEvent);
    } catch (err) {
        console.error("Save Event Error:", err);
        res.status(400).json({ error: err.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().lean();
        const eventsWithParticipants = await Promise.all(events.map(async (event) => {
            const participants = await Participant.find({ eventId: event._id });
            return { ...event, participants }; 
        }));
        res.json(eventsWithParticipants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.participateInEvent = async (req, res) => {
    try {
        const { eventId, name, enrollment, branch, semester } = req.body;
        const newParticipant = new Participant({ eventId, name, enrollment, branch, semester });
        await newParticipant.save();

        const event = await Event.findById(eventId);

        // Notification for teachers
        await Notification.create({
            recipientRole: 'teacher',
            message: `✅ Event Participation: ${name} (${enrollment}) registered for "${event.name}".`
        });

        res.status(200).json({ message: "Participation successful!" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};