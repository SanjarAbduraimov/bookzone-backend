const Joi = require('joi');
const Admin = require('../models/admins');
exports.create = (req, res) => {
  let { error } = validateCreate(req.body);
  if (error) return res.send(error)
  Admin.create({ ...req.body }).then(docs => {
    res.json(docs);
  })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.fetchAdmins = (req, res) => {
  let { error } = validateCreate(req.body);
  if (error) return res.send(error)
  Admin.find()
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.fetchAdminById = (req, res) => {
  Admin.findById(req.params.id)
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.updateAdmin = (req, res) => {
  Admin.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true })
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.deleteAdmin = (req, res) => {
  Admin.findByIdAndDelete(req.params.id)
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