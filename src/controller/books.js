const Joi = require("joi");
const Book = require("../models/books");
const Author = require("../models/authors");
const Comment = require("../models/comments");
const _ = require("lodash");

exports.create = async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).json(error.message);
  try {
    const authorData = await Author.findById(req.locals._id);
    if (!authorData) {
      return res.status(400).json({
        success: false,
        msg: "You don't have a permission to create a book",
      });
    }

    let data = { ...req.body };
    let book = await Book.create({ ...data, author: req.locals._id });
    book = await book.populate("author", "-createdAt").execPopulate();
    const { user, ...docs } = book._doc;
    res.status(201).json({ success: true, payload: docs });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
  // #swagger.tags = ['Book']
  /* #swagger.security = [{
            "apiKeyAuth": []
     }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'create your own book',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/BOOK' }
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/BOOK_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Something went wrong',
         schema: {
            success: false,
            msg: 'Something went wrong / author id is invalid',
            error: 'error.message'
        }
  } */
};

exports.createComment = async (req, res) => {
  try {
    const { _id } = req.locals;
    const { book, text } = req.body;
    const isExists = await Book.findById(book);
    if (!isExists) {
      return res
        .status(400)
        .json({ success: false, msg: "book id is invalid" });
    }
    const comment = await Comment.create({ text, book, user: _id });
    await Book.findByIdAndUpdate(
      book,
      {
        $addToSet: { comments: comment._id },
      },
      { new: true }
    );
    res.status(200).json({ success: true, payload: comment });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: "Something went wrong", error });
  }
  // #swagger.tags = ['Book Comments']
  // #swagger.description = 'Registerd users can proced this action'
  /* #swagger.security = [{
            "apiKeyAuth": []
     }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Post comment',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/COMMENT' }
} */
  /* #swagger.responses[200] = {
           description: 'Response body',
           schema: {$ref: '#/definitions/COMMENT_RESPONSE'}
   } */
  /* #swagger.responses[400] = {
          description: 'Something went wrong',
         schema: {
            success: false,
            msg: 'Something went wrong / author id is invalid',
            error: 'error.message'
        }
  } */
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);
    res.status(200).json({ success: true, payload: comment });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: "Something went wrong", error });
  }
  // #swagger.tags = ['Book Comments']
  // #swagger.description = 'Registerd users can proced this action'
  /* #swagger.security = [{
            "apiKeyAuth": []
     }] */
  /* #swagger.responses[200] = {
           description: 'Response body',
           schema: {$ref: '#/definitions/COMMENT_RESPONSE'}
   } */
  /* #swagger.responses[400] = {
          description: 'Something went wrong',
         schema: {
            success: false,
            msg: 'Something went wrong / book id is invalid',
            error: 'error.message'
        }
  } */
  /* #swagger.responses[401] = {
          description: 'Something went wrong',
         schema: {
            success: false,
            msg: 'Something went wrong  you are not authorization',
            error: 'error.message'
        }
  } */
};

exports.fetchBooks = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const book = await Book.paginate(
      {},
      {
        sort: { name: 1 },
        page,
        limit: pageSize,
        populate: [
          {
            path: "author",
            select: " -createdAt -updatedAt",
          },
          {
            path: "image",
            model: "File",
          },
        ],
      }
    );

    res.status(200).json({ success: true, payload: book });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Someting went wrong",
      error: error.message,
    });
  }
  // #swagger.tags = ['Book']
  // #swagger.description = 'Fetch all books'
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/BOOK_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Someting went wrong',
         schema: {
            success: false,
            msg: 'Someting went wrong',
            error: 'error.message'
        }
  } */
};

exports.searchBooks = async (req, res) => {
  const { title } = req.query;
  try {
    const book = await Book.find({
      title: { $regex: `^${title}`, $options: "i" },
    }).populate([
      { path: "author", select: "-createdAt -updatedAt" },
      { path: "image", model: "File" },
    ]);

    res.status(200).json({ success: true, payload: book });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Someting went wrong",
      error: error.message,
    });
  }

  // #swagger.tags = ['Book']
  // #swagger.description = 'Search book'
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/BOOK_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Book errors page',
         schema: {
            success: false,
            error: 'title can not be empty',
            msg: 'Something went wrong'
        }
  } */
};

exports.fetchCurrentUserBooks = async (req, res) => {
  const { page = 1, pageSize = 10, name = 1 } = req.query;
  try {
    const book = await Book.paginate(
      {
        author: req.locals._id,
      },
      {
        sort: { name: name },
        page,
        limit: pageSize,
        populate: [
          {
            path: "author",
            select: " -createdAt -updatedAt",
          },
          {
            path: "image",
            model: "File",
          },
        ],
      }
    );

    res.status(200).json({ success: true, payload: book });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Someting went wrong",
      error: error.message,
    });
  }
  // #swagger.tags = ['Book']
  // #swagger.description = 'Get your own created book'
  /* #swagger.security = [{
            "apiKeyAuth": []
     }] */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/BOOK_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Someting went wrong',
         schema: {
            success: false,
            msg: 'Someting went wrong',
            error: 'error.message'
        }
  } */
};

exports.fetchBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate([
      {
        path: "author",
        model: "User",
        select: " -createdAt -updatedAt",
      },
      {
        path: "image",
        model: "File",
      },
      {
        path: "comments",
        populate: {
          path: "user",
          model: "User",
          select: "-book -createdAt -updatedAt",
        },
      },
    ]);
    res.status(200).json({ success: true, payload: { book: updatedBook } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
  // #swagger.tags = ['Book']
  // #swagger.description = 'fetch book by id'
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/BOOKID_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Someting went wrong',
         schema: {
            success: false,
            error: 'error.message'
        }
  } */
};

exports.updateBook = async (req, res) => {
  let { error } = validateUpdate(req.body);
  if (error) return res.status(404).json(error.message);
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    ).select("-author");
    res.status(201).json({ success: true, payload: book });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: "Something went wrong",
      error: err.message,
    });
  }
  // #swagger.tags = ['Book']
  /* #swagger.security = [{
            "apiKeyAuth": []
     }] */
  /* #swagger.parameters['id'] = {
        description: 'book id',
        required: true,
        type: 'string',
        schema: { $ref: '#/definitions/BOOK' }
} */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'update your own book',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/BOOK' }
} */
  /* #swagger.responses[200] = {
           description: 'Response body',
           schema: {$ref: '#/definitions/BOOK_RESPONSE'}
   } */
  /* #swagger.responses[400] = {
            description: 'Something went wrong',
           schema: {
              success: false,
              msg: 'Something went wrong',
              error: 'err.message'  
          }
    } */
};
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndDelete(id);
    res.status(201).json({ success: true, payload: book });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: "Something went wrong",
      error: err.message,
    });
  }
  // #swagger.tags = ['Book']
  /* #swagger.security = [{
            "apiKeyAuth": []
     }] */
  /* #swagger.parameters['id'] = {
        description: 'book id',
        required: true,
        type: 'string',
        schema: { $ref: '#/definitions/BOOK' }
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/BOOK_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Something went wrong',
         schema: {
            success: false,
            msg: 'Something went wrong'
        }
  } */
};

exports.fetchBookByAuthorId = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, name = 1 } = req.query;
    const { id } = req.params;
    const authorBooks = await Book.paginate(
      { author: id },
      {
        sort: { name: name },
        page,
        limit: pageSize,
        populate: {
          path: "author",
          select: " -createdAt -updatedAt",
        },
      }
    );

    res.status(200).json({ success: true, payload: authorBooks });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
  // #swagger.tags = ['Book']
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {
            success: true,
            payload: [{$ref: '#/definitions/AUTHOR__BOOKS'}]
          }
  } */
  /* #swagger.responses[400] = {
          description: 'Book errors page',
         schema: {
            success: false,
            error: 'title can not be empty',
            msg: 'Author not found'
        }
  } */
};

function validate(formData) {
  const bookSchema = Joi.object({
    title: Joi.string().required().min(3),
    description: Joi.string(),
    country: Joi.string(),
    language: Joi.string(),
    link: Joi.string(),
    image: Joi.string(),
    pages: Joi.number(),
    year: Joi.date(),
    rate: Joi.number().min(0).max(5),
    price: Joi.number(),
    category: Joi.string().regex(/^(classic|biography|science)$/i),
    isPublished: Joi.boolean(),
    isFeatured: Joi.boolean(),
  });

  return bookSchema.validate(formData);
}

function validateUpdate(formData) {
  const bookSchema = Joi.object({
    title: Joi.string().min(3),
    description: Joi.string(),
    country: Joi.string(),
    language: Joi.string(),
    link: Joi.string(),
    image: Joi.string(),
    oldImg: Joi.string(),
    pages: Joi.number(),
    year: Joi.number(),
    rate: Joi.number().min(0).max(5),
    price: Joi.number(),
    category: Joi.string().regex(/^(classic|biography|science)$/i),
    isPublished: Joi.boolean(),
  });

  return bookSchema.validate(formData);
}
