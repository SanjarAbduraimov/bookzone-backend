const express = require('express');
const { fetchAdmins, create, addFavouriteBook, fetchFavouriteBook, fetchAdminById, updateAdmin, deleteAdmin } = require('../controller/admins');
const { isAdmin } = require('../utils');
const router = express.Router();
router.post('/favorite', isAdmin, addFavouriteBook);
router.get('/favorite', isAdmin, fetchFavouriteBook);
// router.post('/', create);
// router.get('/', fetchAdmins);
router.get('/', isAdmin, fetchAdminById);
router.patch('/', isAdmin, updateAdmin);
router.delete('/', isAdmin, deleteAdmin);

module.exports = router;



