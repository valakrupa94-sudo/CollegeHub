const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true },
    enrollment: { type: String, required: true },
    branch: { type: String },
    semester: { type: String },
    registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Participant', ParticipantSchema);