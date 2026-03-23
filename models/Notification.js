const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipientRole: { type: String, required: true }, // 'student' athva 'teacher'
    message: { type: String, required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);