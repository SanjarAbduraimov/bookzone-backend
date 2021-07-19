var express = require('express');
var router = express.Router();
const userRoutes = require('./users');
const authRoutes = require('./auth');
const authorsRoutes = require('./authors');
const booksRoutes = require('./books');
const homeRoutes = require('./home');

router.use('/api', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/authors', authorsRoutes);
router.use('/api/books', booksRoutes);
// router.use('/api', homeRoutes);

module.exports = router;
