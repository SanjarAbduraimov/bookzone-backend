const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  favorites: Array,
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const User = mongoose.model('users', userSchema);
module.exports = User;