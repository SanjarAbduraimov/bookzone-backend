const Joi = require('joi');
const Book = require('../models/books');
exports.create = (req, res) => {
  let { error } = validateCreate(req.body);
  if (error) return res.send(error.message)
  Book.create({ ...req.body }).then(docs => {
    res.json(docs);
  })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.fetchBooks = async (req, res) => {
  try {
    const book = await Book
      .find()
    // .populate('author')
    // .select('title');

    res.status(200).json(book)
  } catch (error) {
    res.json({ success: false, msg: 'Someting went wrong', error: error.message })
  }

}
exports.fetchBookById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const updatedBook = await Book.findById(id);
    // if (!updatedBook) {
    //   res.
    // }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
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
    title: Joi.string().required().min(3),
  })

  return bookSchema.validate(formData);
}