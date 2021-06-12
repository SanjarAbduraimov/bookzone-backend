const express = require('express');
const { fetchUsers, create, updateUser, deleteUser } = require('../controller/users');
const router = express.Router();
router.get('/users/', fetchUsers);
router.get('/users/:id', fetchUserById);
router.post('/users/', create);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;