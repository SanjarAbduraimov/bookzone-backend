const Joi = require('joi');
const Admin = require('../models/admins');
const { validateToken, getUserData } = require('../utils');
exports.create = (req, res) => {
  const { error } = validateCreate(req.body);
  if (error) return res.json({ success: false, msg: 'Something went wrong', error: error.message })
  Admin.create({ ...req.body }).then(docs => {
    res.json(docs);
  })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.fetchAdmins = (req, res) => {
  Admin.find()
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.fetchAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.locals).populate('favorites');
    res.json({ success: true, admin })
  } catch (error) {
    res.json({ success: false, error: error })
  }
}
exports.updateAdmin = (req, res) => {
  Admin.findByIdAndUpdate(req.locals, { ...req.body, updatedAt: new Date() }, { new: true })
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.addFavouriteBook = async (req, res) => {
  const { bookId } = req.body;
  try {
    const admin = await Admin.findByIdAndUpdate(req.locals, { $addToSet: { "favorites": bookId } }, { new: true })
    res.json({ success: true, admin })
  } catch (error) {
    res.json({ success: false, msg: 'Something went wrong', error: error.message });
  }

}
exports.fetchFavouriteBook = async (req, res) => {
  try {
    const admin = await Admin.findById(req.locals).populate('favorites')
    res.json({ success: true, favorites: admin.favorites })
  } catch (error) {
    res.json({ success: false, msg: 'Something went wrong', error: error.message });
    console.log(req.locals, "not exist locals");
  }
}

// .then(favorites => {
// }).catch(err => {
//   res.json({ success: false, msg: 'Something went wrong', error: err.message });
// })

// }
exports.deleteAdmin = (req, res) => {
  Admin.findByIdAndDelete(req.locals)
    .then(docs => {
      res.json(docs)
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