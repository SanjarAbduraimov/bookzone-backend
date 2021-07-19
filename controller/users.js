const Joi = require('joi');
const Users = require('../models/users');
const Book = require('../models/books');

// exports.create = (req, res) => {
//   // #swagger.tags = ['User']
//   // #swagger.description = 'Endpoint para obter um usuário.'
//   const { error } = validateCreate(req.body);
//   if (error) return res.json({ success: false, msg: 'Something went wrong', error: error.message })
//   Users.create({ ...req.body }).then(docs => {
//     res.status(201).json({ success: true, payload: docs });
//   })
//     .catch(err => res.status(400).json({ success: false, msg: 'Something went wrong', error: err.message }));
// }

// exports.fetchUsers = (req, res) => {
//   Users.find()
//     .then(docs => {
//       res.status(200).json({ success: true, payload: docs })
//     })
//     .catch(err => res.status(400).json({ success: false, msg: 'Something went wrong', error: err.message }));
// }
exports.fetchUserById = async (req, res) => {
  // #swagger.description = 'Only Admin can update a user or User can update his account'
  /* #swagger.security = [{
             "apiKeyAuth": []
      }] */
  // #swagger.tags = ['USER']
  try {
    const user = await Users.findById(req.locals._id).populate('favorites');
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(400).json({ success: false, error: error })
  }
}
exports.updateUser = (req, res) => {
  // #swagger.description = 'Only Admin can update a user or User can update his account'
  /* #swagger.security = [{
             "apiKeyAuth": []
      }] */

  // #swagger.tags = ['USER']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update user',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/USER' }
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/AUTH_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Email or password is wrong'
        }
  } */
  Users.findByIdAndUpdate(req.locals._id, { ...req.body, updatedAt: new Date() }, { new: true })
    .then(docs => {
      res.status(201).json({ success: true, payload: docs })
    })
    .catch(err => res.status(400).json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.addToShelf = async (req, res) => {
  // #swagger.description = 'Only Admin can add a book to own shelf'
  /* #swagger.security = [{
             "apiKeyAuth": []
      }] */
  // #swagger.tags = ['USER']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add book to user shelf',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/SHELF' }
       
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/AUTH_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Email or password is wrong'
        }
  } */

  const { _id } = req.locals;
  const { bookId, shelfName } = req.body;
  try {
    const book = await Book.findById(bookId).select('-user').populate('author');
    await Users.findByIdAndUpdate(_id,
      { $addToSet: { "shelf": bookId } },
      { new: true })

    res.status(201).json({ success: true, payload: book });
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Something went wrong', error: error.message });
  }

}

exports.removeFromShelf = async (req, res) => {
  // #swagger.description = 'Only Admin can remove a book from own shelf'
  /* #swagger.security = [{
             "apiKeyAuth": []
      }] */
  // #swagger.tags = ['SHELF']
  /* #swagger.parameters['body'] = {
        in: 'path',
        description: 'Remove book from user shelf',
        required: true,
        type: 'obj',
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/AUTH_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Email or password is wrong'
        }
  } */
  const { _id } = req.locals;
  const { id } = req.params;
  try {

    const book = await Users.findByIdAndUpdate(_id,
      { $pull: { "shelf": id } },
      { new: true })
      .select('shelf')
      .populate({
        path: 'shelf',
        populate: {
          path: 'author',
          model: 'Author'
        },
      })

    res.status(201).json({ success: true, payload: book });
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Something went wrong', error: error.message });
  }

}

exports.fetchFromShelf = async (req, res) => {
  // #swagger.description = 'Only Admin can get books in own shelf'
  /* #swagger.security = [{
             "apiKeyAuth": []
      }] */
  // #swagger.tags = ['SHELF']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Remove book to user shelf',
        required: true,
        type: 'obj',
       
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/AUTH_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Email or password is wrong'
        }
  } */
  const { _id } = req.locals
  try {
    const userShelf = await Users.findById(_id)
      .select('shelf')
      .populate({
        path: 'shelf',
        populate: {
          path: 'author',
          model: 'Author'
        },
      })
    res.status(200).json({ success: true, payload: userShelf })
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Something went wrong', error: error.message });
  }
}

// .then(favorites => {
// }).catch(err => {
//   res.json({ success: false, msg: 'Something went wrong', error: err.message });
// })

// }
exports.deleteUser = (req, res) => {

  // #swagger.description = 'Only Admin can update a user or User can update his account'
  /* #swagger.security = [{
             "apiKeyAuth": []
      }] */

  // #swagger.tags = ['USER']

  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/AUTH_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Email or password is wrong'
        }
  } */
  Users.findByIdAndDelete(req.locals._id)
    .then(docs => {
      res.status(201).json({ success: true, payload: docs })
    })
    .catch(err => res.status(400).json({ success: false, msg: 'Something went wrong', error: err.message }));
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