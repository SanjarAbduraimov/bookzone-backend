const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  date_of_birth: { tyep: Date, default: '' },
  date_of_dead: { type: Date, default: '' },
  phone: String,
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const User = mongoose.model('author', userSchema);
module.exports = User;