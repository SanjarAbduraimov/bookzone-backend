const Joi = require('joi');
const Admin = require('../models/admins');
const { validateToken } = require('../utils');
exports.create = (req, res) => {
  const { error } = validateCreate(req.body);
  if (error) return res.json({ success: false, msg: 'Something went wrong', error: error.message })
  Admin.create({ ...req.body }).then(docs => {
    res.json({ success: true, payload: docs });
  })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.fetchAdmins = (req, res) => {
  Admin.find()
    .then(docs => {
      res.json({ success: true, payload: docs })
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.fetchAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate('favorites');
    res.json({ success: true, admin })
  } catch (error) {
    res.json({ success: false, error: error })
  }
}
exports.updateAdmin = (req, res) => {
  Admin.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true })
    .then(docs => {
      res.json({ success: true, payload: docs })
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.addFavouriteBook = async (req, res) => {
  const { bookId, id } = req.body;
  try {
    const admin = await Admin.findByIdAndUpdate(id, { $addToSet: { "favorites": bookId } }, { new: true })
    res.json({ success: true, admin })
  } catch (error) {
    res.json({ success: false, msg: 'Something went wrong', error: error.message });
  }

}
exports.fetchFavouriteBook = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const validToken = token ? validateToken(token) : {};
    const admin = await Admin.findById(validToken._id).populate('favorites')
    res.json({ success: true, favorites: admin.favorites })
  } catch (error) {
    res.json({ success: false, msg: 'Something went wrong', error: error.message });
  }
}

// .then(favorites => {
// }).catch(err => {
//   res.json({ success: false, msg: 'Something went wrong', error: err.message });
// })

// }
exports.deleteAdmin = (req, res) => {
  Admin.findByIdAndDelete(req.params.id)
    .then(docs => {
      res.json({ success: true, payload: docs })
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

function validateCreate(formData) {
  const userSchema = Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    phone: Joi.string().regex(/^\+?\d{9,12}$/)
  })

  return userSchema.validate(formData);
}