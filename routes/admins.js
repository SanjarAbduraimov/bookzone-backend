const express = require('express');
const { fetchAdmins,  create, addFavouriteBook, fetchAdminById, updateAdmin, deleteAdmin } = require('../controller/admins');
const router = express.Router();
router.post('/', create);
router.post('/favourite', addFavouriteBook);
router.get('/', fetchAdmins);
router.get('/:id', fetchAdminById);
router.patch('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;



