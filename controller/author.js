const Joi = require('joi');
const Author = require('../models/author');
exports.create = (req, res) => {
  let { error } = validateCreate(req.body);
  if (error) return res.send(error)
  Author.create({ ...req.body }).then(docs => {
    res.json(docs);
  })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.fetchAuthors = (req, res) => {
  let { error } = validateCreate(req.body);
  if (error) return res.send(error)
  Author.find()
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.fetchAuthorById = (req, res) => {
  Author.findById(req.params.id)
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.updateAuthor = (req, res) => {
  Author.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true })
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}
exports.deleteAuthor = (req, res) => {
  Author.findByIdAndDelete(req.params.id)
    .then(docs => {
      res.json(docs)
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

function validateCreate(formData) {
  const authorSchema = Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
  })

  return authorSchema.validate(formData);
}