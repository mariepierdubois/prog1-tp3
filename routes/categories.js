const express = require('express')
const router = express.Router()

const categoryController = require('../controllers/categoryController')

const isConnected = require('../middleware/is-connected')

// Return the categories list
router.get('/', categoryController.getCategories)

// Return the category which the id is in the url
router.get('/:id', categoryController.getCategoryId)

// Only the admin can create a category
router.post('/', isConnected, categoryController.createNewCategory)

// Only the admin can update a category
router.put('/:id', isConnected, categoryController.putCategory)

// Delete a single category (which id is in the url)
router.delete('/:id', isConnected, categoryController.deleteCategory)

module.exports = router
