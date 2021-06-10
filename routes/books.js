const express = require('express');
const { isAdmin } = require('../utils');

const { create, fetchBooks, fetchBookById, updateBook, deleteBook } = require('../controller/books');

const router = express.Router();
router.post('/', isAdmin, create);
router.get('/', fetchBooks);
router.get('/:id', fetchBookById);
router.patch('/:id', isAdmin, updateBook);
router.delete('/:id', isAdmin, deleteBook);
module.exports = router;