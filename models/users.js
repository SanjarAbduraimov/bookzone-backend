const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  phone: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);
module.exports = User;