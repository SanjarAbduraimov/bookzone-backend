const Joi = require('joi');
const Book = require('../models/books');
const Author = require('../models/authors');
const Comment = require('../models/comments');
const _ = require('lodash');
exports.create = async (req, res) => {
  console.log(req.file)
  let { error } = validate(req.body);
  if (error) return res.status(400).json(error.message)
  try {
    const { author } = req.body;
    const authorData = await Author.findById(author);
    if (!authorData) {
      return res.status(400).json({ success: false, msg: 'author id is invalid', })
    }

    let data = { ...req.body }

    if (req.file) {
      const img = req.file.path.replace("public", "");
      data.imageLink = img
    }
    const book = await Book.create({ ...data, user: req.locals._id });
    const { user, ...docs } = book._doc;
    res.status(200).json({ success: true, payload: docs })
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Something went wrong', error })
  }
}
exports.createComment = async (req, res) => {
  try {
    const { _id } = req.locals;
    const { bookId, text } = req.body
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(400).json({ success: false, msg: 'book id is invalid', })
    }
    const comment = await Comment.create({ text, bookId, user: _id });
    res.status(200).json({ success: true, payload: comment })
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Something went wrong', error })
  }
}

exports.fetchBooks = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {
    const book = await Book
      .paginate({},
        {
          sort: { name: 1 },
          page,
          limit: pageSize,
          populate: { path: "author", select: "-_id -user -createdAt -updatedAt -phone" },
          select: "-user"
        })

    res.status(200).json({ success: true, payload: book })
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Someting went wrong', error: error.message })
  }

}
exports.searchBooks = async (req, res) => {
  const { title } = req.query;
  try {
    const book = await Book
      .find({ title: { $regex: `^${title}`, $options: 'i' } })
      .select('-user')
      .populate('author', '-_id -createdAt -updatedAt')

    res.status(200).json({ success: true, payload: book })
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Someting went wrong', error: error.message })
  }

}

exports.fetchCurrentUserBooks = async (req, res) => {
  try {
    const book = await Book
      .find({ user: req.locals._id })
      .select('-user')
      .populate('author', '-createdAt -updatedAt -phone')

    res.status(200).json({ success: true, payload: book })
  } catch (error) {
    res.status(400).json({ success: false, msg: 'Someting went wrong', error: error.message })
  }

}
exports.fetchBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book
      .findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
      .select('-user')
      .populate('author', '-createdAt -updatedAt -phone');
    const comment = await Comment.find({ bookId: id })
      .populate('user', "-_id firstName lastName ");
    res.status(200).json({ success: true, payload: { book: updatedBook, comment } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
exports.updateBook = async (req, res) => {
  let { error } = validateUpdate(req.body);
  if (error) return res.status(404).json(error.message)
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndUpdate(id, { ...req.body }, { new: true });
    res.status(201).json({ success: true, payload: book })
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Something went wrong', error: err.message })
  }
}
exports.deleteBook = (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(docs => {
      res.json({ success: true, payload: docs })
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

function validate(formData) {
  const bookSchema = Joi.object({
    title: Joi.string().required().min(3),
    description: Joi.string(),
    author: Joi.string().required(),
    country: Joi.string(),
    imageLink: Joi.string(),
    language: Joi.string(),
    link: Joi.string(),
    pages: Joi.number(),
    year: Joi.number(),
    rate: Joi.number().min(0).max(5),
    price: Joi.number(),
    category: Joi.string().regex(/^(classic|biography|science)$/i),
    isPublished: Joi.boolean(),
  })

  return bookSchema.validate(formData);
}
function validateUpdate(formData) {
  const bookSchema = Joi.object({
    title: Joi.string().required().min(3),
    description: Joi.string(),
    country: Joi.string(),
    language: Joi.string(),
    link: Joi.string(),
    pages: Joi.number(),
    year: Joi.number(),
    rate: Joi.number().min(0).max(5),
    price: Joi.number(),
    category: Joi.string().regex(/^(classic|biography|science)$/i),
    isPublished: Joi.boolean(),
  })

  return bookSchema.validate(formData);
}
