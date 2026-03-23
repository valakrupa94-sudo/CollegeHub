const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    
    members: [{
        name: String,
        enrollmentNo: String, 
        branch: String,
        semester: String      
    }]
});

module.exports = mongoose.model('Club', clubSchema);