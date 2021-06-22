const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  favorites: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;