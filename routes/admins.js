const express = require('express');
const { fetchAdmins, create, addToShelf, fetchFromShelf, fetchAdminById, updateAdmin, deleteAdmin } = require('../controller/admins');
const router = express.Router();

router.post('/', create);
router.post('/shelf', addToShelf);
router.get('/shelf', fetchFromShelf);
router.get('/', fetchAdmins);
router.get('/:id', fetchAdminById);
router.patch('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;



