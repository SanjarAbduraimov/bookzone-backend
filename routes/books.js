const express = require('express');
const { isAdmin, currentUser, } = require('../utils');
const { create, fetchBooks, fetchBookById, updateBook, deleteBook, fetchCurrentUserBooks } = require('../controller/books');

const router = express.Router();
router.get('/my-books', currentUser, fetchCurrentUserBooks);
router.get('/', fetchBooks);
router.get('/:id', fetchBookById);
router.post('/', currentUser, create);
router.patch('/:id', isAdmin, updateBook);
router.delete('/:id', isAdmin, deleteBook);
module.exports = router;