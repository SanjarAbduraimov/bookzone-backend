import express from 'express';
import { create, fetchAuthors, fetchAuthorById, updateAuthor, deleteAuthor } from '../controller/authors.js';
import { currentUser } from '../utils/index.js';
const router = express.Router();
router.get('/', fetchAuthors);
router.get('/:id', fetchAuthorById);
// router.post('/', currentUser, create);
// router.patch('/:id', currentUser, updateAuthor);
// router.delete('/:id', currentUser, deleteAuthor);

export default router;
