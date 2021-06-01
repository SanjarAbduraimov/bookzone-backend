const express = require('express');
const Joi = require('joi');
const router = express.Router();
let categories = [
  {
    id: 1,
    name: 'DevOps',
  },
  {
    id: 2,
    name: 'programming',
  },
  {
    id: 3,
    name: 'Network',
  },
  {
    id: 4,
    name: 'Cyber Security',
  },
  {
    id: 5,
    name: 'Database',
  },
]


router.get('/', (req, res) => {
  res.send(categories);
})

router.get('/:id', (req, res) => {
  const category = categories.find(i => i.id === +req.params.id)
  if (!category) return res.send('category not found')
  res.send(category);
})

router.post('/', (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) {
    return res.send(error.message)
  }

  const category = {
    id: categories.length + 1,
    name: req.body.name,
  }

  categories = [...categories, category]
  res.send(categories);
})

router.put('/:id', function (req, res) {
  let category = categories.find(i => i.id === +req.params.id)
  if (!category) return res.status(404).send('Category not found')
  const { error } = validateCategory(req.body);
  if (error) return res.send(error.message);

  category.name = req.body.name;

  res.send(categories)
})

router.delete('/:id', (req, res) => {
  // ro'yxatni id si bo'yicha filter qilsin
  let category = categories.find(i => i.id === +req.params.id);
  // Agar Ro'yxatda mavjud bo'lamasa 404 xatoligini qaytarsin
  if (!category) return res.status(404).send('Category not found');

  // Aks xolda o'sha malumotni bazadan o'chirsin
  let categoryIndex = categories.indexOf(category)
  categories.splice(categoryIndex, 1)
  res.send(categories)
})

function validateCategory(formData) {

  const orderSchema = Joi.object({
    name: Joi.string().required().min(3),
  })

  return orderSchema.validate(formData);
}

module.exports = router;