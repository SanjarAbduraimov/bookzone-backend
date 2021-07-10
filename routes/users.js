const express = require('express');
const { fetchUsers, create, addToShelf, fetchFromShelf, fetchUserById, updateUser, deleteUser } = require('../controller/users');
const router = express.Router();
const { currentUser } = require('../utils');

router.post('/', create);
router.post('/shelf', currentUser, addToShelf);
router.delete('/shelf/:id', currentUser, removeFromShelf);
router.get('/shelf', currentUser, fetchFromShelf);
router.get('/', currentUser, fetchUsers);
router.get('/:id', fetchUserById);
router.patch('/:id', currentUser, updateUser);
router.delete('/:id', currentUser, deleteUser);

module.exports = router;



