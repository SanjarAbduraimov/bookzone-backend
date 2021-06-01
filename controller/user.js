const Joi = require('joi');
const User = require('../models/user');
exports.create = (req, res) => {
  let { error } = validateCreate(req.body);
  if (error) return res.send(error)
  User.create({ ...req.body }).then(docs => {
    res.json(docs);
  })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.fetchUsers = (req, res) => {
  let { error } = validateCreate(req.body);
  if (error) return res.send(error)
  User.find()
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.fetchUserById = (req, res) => {
  User.findById(req.params.id)
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true })
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.deleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

function validateCreate(formData) {
  const userSchema = Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
  })

  return userSchema.validate(formData);
}