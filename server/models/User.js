const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['employee', 'hr', 'admin'] },
    employeeId: { type: String, required: true, unique: true },   // New field
    department: { type: String, required: true }                  // New field
});

module.exports = mongoose.model('User', userSchema);
