const express = require('express');
const { fetchAdmins,  create, fetchAdminById, updateAdmin, deleteAdmin } = require('../controller/admins');
const router = express.Router();
router.post('/', create);
// router.get('/', fetchAdmins);
router.get('/:id', fetchAdminById);
router.patch('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;