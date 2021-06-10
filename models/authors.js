const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
});

const Author = mongoose.model('authors', authorSchema);
module.exports = Author;
