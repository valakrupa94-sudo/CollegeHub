const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
},
    
    clubId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Club',
        required: true 
    }
});

module.exports = mongoose.model('Event', eventSchema);