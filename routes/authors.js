var express = require('express');
const { create, fetchAuthors, fetchAuthorById, updateAuthor, deleteAuthor } = require('../controller/authors');
const { isAdmin } = require('../utils');
var router = express.Router();
router.get('/', fetchAuthors);
router.get('/:id', fetchAuthorById);
router.post('/', isAdmin, create);
router.patch('/:id', isAdmin, updateAuthor);
router.delete('/:id', isAdmin, deleteAuthor);

module.exports = router;
