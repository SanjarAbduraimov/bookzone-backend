const mongoose = require('mongoose');
const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'authors' },
  country: String,
  imageLink: String,
  language: String,
  link: String,
  pages: Number,
  year: Number,
  views: { type: Number, default: 0 },
  rate: { type: Number, min: 0, max: 5 },
  category: {
    type: String,
    enum: ['classic', 'biography', 'science'],
    lowercase: true,
  },
  isPublished: Boolean,
})
const Book = mongoose.model('books', bookSchema);
module.exports = Book;
