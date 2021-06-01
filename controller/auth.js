const User = require('../models/user');
const Joi = require('joi');

exports.signUp = async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.send('please fill the requirements')
  try {
    await User.create({ ...req.body })
  } catch (error) {
    console.log(error);
  }
}
exports.login = async (req, res) => {
  let { error } = validate(req.query);
  if (error) return res.status(400).send(error.message);
  try {
    await User.findOne({ ...req.query }).then(i => {
      res.json(i);
    }).catch(err => {
      res.send(err)
    })
  } catch (err) {
    console.log(err);
  }
}

function validate(formData) {
  const orderSchema = Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(20)
    // lastName: Joi.string().required().min(3).max(20),
    // email: Joi.string().required().email(),
    // password: Joi.string().min(8).max(20),
    // phone: Joi.number().min(9).max(13)
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