const Joi = require('joi');
const Book = require('../models/books');
const Author = require('../models/authors');
exports.create = async (req, res) => {
  const { error } = validate(req.body);
  const { id } = req.locals;
  if (error) return res.json(error.message);
  try {
    const { author } = req.body;
    const user = await Author.findById(author);
    if (!user) {
      res.json({ success: false, msg: 'author id is invalid', });
    }
    const book = await Book.create({ ...req.body, user_id: id });
    res.status(200).json(book);
  } catch (error) {
    res.json({ success: false, msg: 'Something went wrong', error })
  }
}

exports.fetchBooks = async (req, res) => {
  try {
    const book = await Book
      .find()
      .populate('author', '-_id -createdAt -updatedAt -phone')

    res.status(200).json(book)
  } catch (error) {
    res.json({ success: false, msg: 'Someting went wrong', error: error.message })
  }

}
exports.fetchBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book
      .findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
      .populate('author', '-_id -createdAt -updatedAt -phone');
    res.status(200).json(updatedBook);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
}
exports.updateBook = (req, res) => {
  let { error } = validateUpdate(req.body);
  if (error) return res.json(error.message)
  const { id } = req.params;
  Book.findByIdAndUpdate(id, { ...req.body, updatedAt: new Date() }, { new: true })
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.deleteBook = (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(docs => {
      res.json(docs)
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
    updatedAt: Joi.date()
  })

  return bookSchema.validate(formData);
}
function validateUpdate(formData) {
  const bookSchema = Joi.object({
    title: Joi.string().required().min(3),
    description: Joi.string(),
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
    updatedAt: Joi.date()
  })

  return bookSchema.validate(formData);
}