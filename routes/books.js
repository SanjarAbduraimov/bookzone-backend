const express = require('express');
const { currentUser, isOwner, } = require('../utils');
const { create, createComment, fetchBooks, searchBooks, fetchBookById, updateBook, deleteBook, fetchCurrentUserBooks } = require('../controller/books');
var multer = require('../utils/multer');

const router = express.Router();
router.get('/my-books', currentUser, fetchCurrentUserBooks);
router.get('/', fetchBooks);
router.get('/search', searchBooks);
router.get('/:id', fetchBookById);
router.post('/', multer.single('image'), currentUser, create);
router.post('/comment', currentUser, createComment);
router.delete('/comment/:id', isOwner, currentUser, createComment);
router.patch('/:id', currentUser, isOwner, updateBook);
router.delete('/:id', currentUser, isOwner, deleteBook);
module.exports = router;