const express = require('express');
const { fetchUsers, create, addToShelf, fetchFromShelf, fetchUserById, updateUser, deleteUser, removeFromShelf } = require('../controller/users');
const router = express.Router();
const { currentUser } = require('../utils');

// router.post('/', create);
router.get('/', currentUser, fetchUserById);
router.post('/shelf', currentUser, addToShelf);
router.delete('/shelf/:id', currentUser, removeFromShelf);
router.get('/shelf', currentUser, fetchFromShelf);
// router.get('/', currentUser, fetchUsers);
router.patch('/:id', currentUser, updateUser);
router.delete('/:id', currentUser, deleteUser);

module.exports = router;



