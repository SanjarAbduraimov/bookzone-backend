const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  favorites: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'books' }],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const User = mongoose.model('admins', adminSchema);
module.exports = User;