const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  favorites: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Book' }],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  isAdmin: { type: Boolean, default: true },
});

const User = mongoose.model('Admin', adminSchema);
module.exports = User;