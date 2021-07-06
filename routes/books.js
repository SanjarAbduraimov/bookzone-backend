const express = require('express');
const { isAdmin, currentUser, } = require('../utils');
const { create, createComment, fetchBooks, searchBooks, fetchBookById, updateBook, deleteBook, fetchCurrentUserBooks } = require('../controller/books');
var multer = require('../utils/multer');

const router = express.Router();
router.get('/my-books', currentUser, isAdmin, fetchCurrentUserBooks);
router.get('/', fetchBooks);
router.get('/search', searchBooks);
router.get('/:id', fetchBookById);
router.post('/', multer.single('image'), currentUser, isAdmin, create);
router.post('/comment', currentUser, createComment);
router.patch('/:id', currentUser, isAdmin, updateBook);
router.delete('/:id', currentUser, isAdmin, deleteBook);
module.exports = router;