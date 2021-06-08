const express = require('express');
const { create, fetchBooks, fetchBookById, updateBook, deleteBook } = require('../controller/books');

const router = express.Router();
router.post('/', create);
router.get('/', fetchBooks);
router.get('/:id', fetchBookById);
router.patch('/:id', updateBook);
router.delete('/:id', deleteBook);
module.exports = router;