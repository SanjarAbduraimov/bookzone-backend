var express = require('express');
const { create, fetchAuthors, fetchAuthorById, updateAuthor, deleteAuthor } = require('../controller/author');
var router = express.Router();
router.get('/', fetchAuthors);
router.post('/', create);
router.get('/:id', fetchAuthorById);
router.patch('/:id', updateAuthor);
router.delete('/:id', deleteAuthor);

module.exports = router;
