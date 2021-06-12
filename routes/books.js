const express = require('express');
const { isAdmin } = require('../utils');
const { create, fetchBooks, fetchBookById, updateBook, deleteBook } = require('../controller/books');

const router = express.Router();
router.get('/', fetchBooks);
router.get('/:id', fetchBookById);
router.post('/', isAdmin, create);
router.patch('/:id', isAdmin, updateBook);
router.delete('/:id', isAdmin, deleteBook);
module.exports = router;