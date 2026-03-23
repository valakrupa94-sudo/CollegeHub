const mongoose = require('mongoose');

const ClubRegisterSchema = new mongoose.Schema({
    clubId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Club', 
        required: true 
    },
    name: { type: String, required: true },
    enrollmentNo: { type: String, required: true },
    branch: { type: String },
    semester: { type: String },
    joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClubRegister', ClubRegisterSchema);