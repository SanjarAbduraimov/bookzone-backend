const express = require('express');
const { fetchUsers, fetchUserById: create, updateUser, deleteUser } = require('../controller/user');
const router = express.Router();
router.post('/', create);
router.get('/', fetchUsers);
router.get('/:id', fetchUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
module.exports = router;