const mongoose = require('mongoose');
const bookSchema = mongoose.Schema({
  author: String,
  country: String,
  imageLink: String,
  language: String,
  link: String,
  pages: Number,
  title: String,
  year: Number,
})
const Book = mongoose.model('book', bookSchema);
module.exports = Book;
