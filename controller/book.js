const Joi = require('joi');
const Book = require('../models/book');
exports.create = (req, res) => {
  // let { error } = validateCreate(req.body);
  // if (error) return res.send(error)
  Book.create({ ...req.body }).then(docs => {
    res.json(docs);
  })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.fetchBooks = (req, res) => {
  Book.find()
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.fetchBookById = (req, res) => {
  Book.findById(req.params.id)
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.updateBook = (req, res) => {
  Book.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true })
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

function validateCreate(formData) {
  const bookSchema = Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
  })

  return bookSchema.validate(formData);
}