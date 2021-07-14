const Joi = require('joi');
const Author = require('../models/authors');

exports.create = (req, res) => {
  // #swagger.tags = ['Author']
  // #swagger.description = 'Registerd users can proced this action'
  /* #swagger.security = [{
              "apiKeyAuth": []
       }] */

  /* #swagger.parameters['body'] = {
   in: 'body',
   description: 'Create author body',
   required: true,
   type: 'obj',
   schema: { $ref: '#/definitions/AUTHOR' }
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {
            success: true,
            payload: {$ref: '#/definitions/AUTHOR'}
          }
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Something went wrong',
            error: 'error message'
        }
  } */
  let { error } = validateCreate(req.body);
  if (error) return res.send(error)
  Author.create({ ...req.body }).then(docs => {
    res.json({ success: true, payload: docs });
  })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.fetchAuthors = (req, res) => {
  // #swagger.tags = ['Author']

  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {
            success: true,
            payload: [{$ref: '#/definitions/AUTHOR'}]
          }
  } */

  let { error } = validateCreate(req.body);
  if (error) return res.send(error)
  Author.find()
    .then(docs => {
      res.json({ success: true, payload: docs })
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.fetchAuthorById = (req, res) => {
  // #swagger.tags = ['Author']
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {
            success: true,
            payload: {$ref: '#/definitions/AUTHOR'}
          }
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Something went wrong',
            error: 'error message'
        }
  } */
  /* #swagger.responses[500] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Something went wrong',
            error: 'error message'
        }
  } */
  Author.findById(req.params.id)
    .then(docs => {
      res.json({ success: true, payload: docs })
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.updateAuthor = (req, res) => {
  // #swagger.tags = ['Author']
  // #swagger.description = 'Registerd users can proced this action'
  /* #swagger.security = [{
              "apiKeyAuth": []
       }] */
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Create author body',
    required: true,
    type: 'obj',
    schema: { $ref: '#/definitions/AUTHOR' }
 } */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/AUTHOR'}
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Something went wrong',
            error: 'error message'
        }
  } */
  Author.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true })
    .then(docs => {
      res.json({ success: true, payload: docs })
    })
    .catch(err => res.json({ success: false, msg: 'Something went wrong', error: err.message }));
}

exports.deleteAuthor = (req, res) => {
  // #swagger.tags = ['Author']
  // #swagger.description = 'Registerd users can proced this action'
  /* #swagger.security = [{
              "apiKeyAuth": []
       }] */
  /* #swagger.responses[200] = {
        description: 'Response body',
        schema: {
          success: true,
          payload: {$ref: '#/definitions/AUTHOR'}
        }
  } */
  /* #swagger.responses[500] = {
    description: 'Response body',
    schema: {
      success: false,
      msg: 'Something went wrong', 
      error: ''
    }
  } */
  Author.findByIdAndDelete(req.params.id)
    .then(docs => {
      res.json({ success: true, payload: docs })
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