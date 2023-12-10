import express from 'express';
import * as userController from '../controller/users.js';
const router = express.Router();

import { currentUser } from '../utils/index.js';
import multer from '../utils/multer.js';

router.get('/', currentUser, userController.fetchUserById);
router.post('/shelf', currentUser, userController.addToShelf);
// router.post('/files', currentUser, multer.single('image'), userController.addProfilePicture);
router.delete('/shelf/:id', currentUser, userController.removeFromShelf);
router.get('/shelf', currentUser, userController.fetchFromShelf);
// router.get('/', currentUser, userController.fetchUsers);
router.patch('/', currentUser, userController.updateUser);
router.delete('/', currentUser, userController.deleteUser);

export default router;



