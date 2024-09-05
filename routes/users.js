import express from 'express';
import * as userController from '../controller/users.js';
const router = express.Router();

import { auth } from '../utils/index.js';

router.get('/', auth, userController.fetchUserById);
router.post('/shelf', auth, userController.addToShelf);
router.delete('/shelf/:id', auth, userController.removeFromShelf);
router.get('/shelf', auth, userController.fetchFromShelf);
router.patch('/', auth, userController.updateUser);
router.delete('/', auth, userController.deleteUser);

export default router;



