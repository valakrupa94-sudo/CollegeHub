const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },

    enrollmentNo: { type: String },
    branch: { type: String },
    semester: { type: String },

    department: { type: String },
    employeeId: { type: String }
});

userSchema.pre('save', async function() {
    
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);
