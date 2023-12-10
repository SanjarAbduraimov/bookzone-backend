import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'My express app', signUp: 'Sign Up' });
})

export default router;