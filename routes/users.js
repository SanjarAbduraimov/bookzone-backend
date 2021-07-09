const express = require('express');
const { fetchUsers, create, addToShelf, fetchFromShelf, fetchUserById, updateUser, deleteUser } = require('../controller/users');
const router = express.Router();

router.post('/', create);
router.post('/shelf', addToShelf);
router.get('/shelf', fetchFromShelf);
router.get('/', fetchUsers);
router.get('/:id', fetchUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;



