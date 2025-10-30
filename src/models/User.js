const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    faculty: String,
    nationality: String,
    interests: [{ type: String }]
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
