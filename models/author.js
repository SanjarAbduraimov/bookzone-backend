const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  date_of_birth: { tyep: Date },
  date_of_dead: { type: Date },
  phone: String,
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
});

const Author = mongoose.model('author', authorSchema);
module.exports = Author;