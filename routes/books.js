const express = require('express');
const { isAdmin, currentUser, } = require('../utils');
const { create, createComment, fetchBooks, searchBooks, fetchBookById, updateBook, deleteBook, fetchCurrentUserBooks } = require('../controller/books');

const router = express.Router();
router.get('/my-books', currentUser, fetchCurrentUserBooks);
router.get('/', fetchBooks);
router.get('/search', searchBooks);
router.get('/:id', fetchBookById);
router.post('/', currentUser, create);
router.post('/comment', currentUser, createComment);
router.patch('/:id', isAdmin, updateBook);
router.delete('/:id', isAdmin, deleteBook);
module.exports = router;