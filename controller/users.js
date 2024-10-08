const Joi = require("joi");
const Users = require("../models/users");
const Book = require("../models/books");
const Author = require("../models/authors");

// exports.create = (req, res) => {
//   // #swagger.tags = ['Auth']
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
  try {
    const user = await Users.findById(req.locals._id).populate([
      { path: "image", model: "File" },
      { path: "shelf", model: "Book" },
    ]);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error });
  }
  // #swagger.tags = ['User']
  // #swagger.description = 'Only Admin can update a user or User can update his account'
  /* #swagger.security = [{
             "apiKeyAuth": []
      }] */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/USER_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
    description: 'Response body',
    schema: {
      success: false,
      error: ''
    }
  } */
};

exports.updateUser = async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
  const user = await Users.findByIdAndUpdate(
    req.locals._id,
    { ...req.body, updatedAt: new Date() },
    { new: true }
  ).populate([{ path: "image", model: "File" }]);
  await Author.findByIdAndUpdate(user._id, {
    ...req.body,
    updatedAt: new Date(),
  });

  res.status(201).json({ success: true, payload: user });

  // #swagger.tags = ['User']
  // #swagger.description = 'Only Admin can update a user or User can update his account'
  /* #swagger.security = [{
             "apiKeyAuth": []
      }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update user',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/UPDATE_USER' }
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/USER_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Response body',
         schema: {
            success: false,
            msg: 'Something went wrong'
        }
  } */
};
exports.addToShelf = async (req, res) => {
  const { _id } = req.locals;
  const { bookId, shelfName } = req.body;
  try {
    await Book.findById(bookId);
    const userShelf = await Users.findByIdAndUpdate(
      _id,
      { $addToSet: { shelf: bookId } },
      { new: true }
    ).select("shelf -_id");

    res.status(201).json({ success: true, payload: userShelf });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }

  // #swagger.tags = ['Shelf']
  // #swagger.description = 'Only Admin can add a book to own shelf'
  /* #swagger.security = [{
             "apiKeyAuth": []
      }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add book to user shelf',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/SHELF' }
       
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/SHELF_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Something went wrong',
            error: 'error.message'
        }
  } */
};

exports.removeFromShelf = async (req, res) => {
  const { _id } = req.locals;
  const { id } = req.params;
  try {
    const book = await Users.findByIdAndUpdate(
      _id,
      { $pull: { shelf: id } },
      { new: true }
    )
      .select("shelf")
      .populate({
        path: "shelf",
        populate: {
          path: "author",
          model: "Author",
        },
      });

    res.status(201).json({ success: true, payload: book });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }

  // #swagger.tags = ['Shelf']
  // #swagger.description = 'Only Admin can remove a book from own shelf'
  /* #swagger.security = [{
             "apiKeyAuth": []
      }] */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/SHELF_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
             msg: 'Something went wrong', 
             error: 'error.message'
        }
  } */
};

exports.fetchFromShelf = async (req, res) => {
  const { _id } = req.locals;
  try {
    const userShelf = await Users.findById(_id)
      .select("shelf -_id")
      .populate({
        path: "shelf",
        populate: {
          path: "author",
          model: "Author",
        },
      });
    res.status(200).json({ success: true, payload: userShelf });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }

  // #swagger.tags = ['Shelf']
  // #swagger.description = 'Only Admin can get books in own shelf'
  /* #swagger.security = [{
             "apiKeyAuth": []
      }] */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/SHELF_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
           msg: 'Something went wrong',
           error: 'error.message' 
        }
  } */
};
exports.deleteUser = (req, res) => {
  Users.findByIdAndDelete(req.locals._id)
    .then((docs) => {
      res.status(201).json({ success: true, payload: docs });
    })
    .catch((err) =>
      res.status(400).json({
        success: false,
        msg: "Something went wrong",
        error: err.message,
      })
    );

  // #swagger.description = 'Only User can remove his account'
  /* #swagger.security = [{
             "apiKeyAuth": []
      }] */

  // #swagger.tags = ['User']

  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/USER_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Response body',
         schema: {
            success: false,
            msg: 'Something went wrong',
            error: 'err.message'
        }
  } */
};

function validateUpdate(formData) {
  const userSchema = Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
    // email: Joi.string().email(),
    // password: Joi.string().min(6),
    phone: Joi.string().regex(/^\+?\d{9,12}$/),
    lang: Joi.string().valid("uz", "ru", "en"),
    image: Joi.string(),
    address: Joi.string(),
  });

  return userSchema.validate(formData);
}
