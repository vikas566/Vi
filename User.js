const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);