const Joi = require('joi');
const Users = require('../models/users');
const Book = require('../models/books');

const { validateToken } = require('../utils');

exports.create = (req, res) => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Endpoint para obter um usuário.'
  const { error } = validateCreate(req.body);
  if (error) return res.json({ success: false, msg: 'Something went wrong', error: error.message })
  Users.create({ ...req.body }).then(docs => {
    res.json({ success: true, payload: docs });
  })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.fetchUsers = (req, res) => {
  Users.find()
    .then(docs => {
      res.json({ success: true, payload: docs })
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.fetchUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id).populate('favorites');
    res.json({ success: true, user })
  } catch (error) {
    res.json({ success: false, error: error })
  }
}
exports.updateUser = (req, res) => {
  Users.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true })
    .then(docs => {
      res.json({ success: true, payload: docs })
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.addFavouriteBook = async (req, res) => {
  const { bookId, id } = req.body;
  try {
    const user = await Users.findByIdAndUpdate(id, { $addToSet: { "favorites": bookId } }, { new: true })
    res.json({ success: true, user })
  } catch (error) {
    res.json({ success: false, msg: 'Something went wrong', error: error.message });
  }

}
exports.addToShelf = async (req, res) => {
  const { _id } = req.locals;
  const { bookId, shelfName } = req.body;
  try {
    const book = await Book.findById(bookId).select('-user').populate('author');
    await Users.findByIdAndUpdate(_id,
      { $addToSet: { "shelf": bookId } },
      { new: true })

    res.json({ success: true, payload: book });
  } catch (error) {
    res.json({ success: false, msg: 'Something went wrong', error: error.message });
  }

}

exports.removeFromShelf = async (req, res) => {
  const { _id } = req.locals;
  const { id: bookId } = req.query;
  try {

    await Users.findByIdAndUpdate(_id,
      { $pull: { "shelf": bookId } },
      { new: true })

    res.json({ success: true, payload: book });
  } catch (error) {
    res.json({ success: false, msg: 'Something went wrong', error: error.message });
  }

}

exports.fetchFromShelf = async (req, res) => {
  const { _id } = req.locals
  try {
    const userShelf = await Users.findById(_id)
      .select('shelf')
      .populate('shelf')
    res.json({ success: true, payload: userShelf })
  } catch (error) {
    res.json({ success: false, msg: 'Something went wrong', error: error.message });
  }
}

// .then(favorites => {
// }).catch(err => {
//   res.json({ success: false, msg: 'Something went wrong', error: err.message });
// })

// }
exports.deleteUser = (req, res) => {
  Users.findByIdAndDelete(req.params.id)
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
    phone: Joi.string().regex(/^\+?\d{9,12}$/),
  })

  return userSchema.validate(formData);
}