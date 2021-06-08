const User = require('../models/user');
const Joi = require('joi');
// const bcrypt = require('bcrypt');
const { createToken } = require('../utils/token');
exports.signUp = async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).json({ success: false, msg: error.message });
  try {
    let user = await User.create({ ...req.body });
    let token = createToken({ userId: user._id });
    res.status(201).json({ token, payload: user, success: true });
  } catch (error) {
    res.json({ success: false, msg: error.message })
  }
}
exports.login = async (req, res) => {
  let { email, password } = req.body;
  let { error } = validate(req.body);
  if (error) return res.status(400).json({ success: false, msg: error.message });
  try {
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, msg: 'No account exist with this email' })
    }
    const isPasswordCorreect = await bcrypt.compare(password, user.password);
    if (isPasswordCorreect) {
      let token = createToken({ userId: user._id });
      return res.status(200).json({ token, user, success: true })
    }
    return res.json({ success: false, error: 'Email or password is incorrect' })

  } catch (err) {
    res.json({ success: false, error: err.message })
  }
}

function validate(formData) {
  const orderSchema = Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    phone: Joi.string().regex(/^\+?\d{9,12}$/)
  })

  return orderSchema.validate(formData);
}
// async function createBook() {
//   const user = new User({
//     type: ['hight', 'sanjarbek'],
//     firstName: 'Sanjarbek',
//     lastName: 'Abduriamov',
//     email: 'sanjarbekweb@gmail.com',
//     password: 'shuparol',
//   });

//   const savedUser = await user.save()
//   console.log(savedUser);
// }

// createBook().then(i => {
//   console.log('user saved successfully!')
// });