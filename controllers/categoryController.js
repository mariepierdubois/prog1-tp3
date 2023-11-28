'use strict'

const Category = require('../models/category')
const User = require('../models/user')

// Get a list of all of the products (sold and not sold)
exports.getCategories = (req, res, next) => {
  Category.find().sort({ name: 1 })
    .then(categories => {
      res.status(200).json({
        categories,
        pageTitle: 'All the categories on the website'
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
    })
}

// Get the info of the /categories/:id
exports.getCategoryId = (req, res, next) => {
  // Get the category ID from the URL
  const categoryId = req.params.id

  Category.findById(categoryId)
    .then(category => {
      if (!category) {
        // If no category found with the given ID, then return an error response
        return res.status(404).json({ message: 'Category not found' })
      }

      res.status(200).json({
        category,
        pageTitle: `You are looking at the category with the ID ${categoryId}`
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: 'Internal server error' })
    })
}

// Create a new category
// Only the admin is authorized
exports.createNewCategory = (req, res, next) => {
  const { name } = req.body
  const connectedUserId = req.user.userId

  // Verify if the user is connected first
  User.findById(connectedUserId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Check if the connected user is an admin
      if (!user.isAdmin) {
        return res.status(401).json({ message: 'You are not an admin, so not authorized to create a category.' })
      }

      const category = new Category({ name })

      category.save()
        .then(result => {
          res.status(201).json({
            message: 'Your category is created',
            category: result
          })
        })
        .catch(err => {
          return res.status(422).json({
            errorMessage: err.errors
          })
        })
    })
    .catch(err => {
      next(err)
    })
}

exports.putCategory = (req, res, next) => {
  const { name } = req.body
  const categoryId = req.params.id
  const connectedUserId = req.user.userId

  // Check if the user is connected
  User.findById(connectedUserId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found ' })
      }

      // Check if the user is admin
      if (!user.isAdmin) {
        return res.status(401).json({ message: 'You are not an admin, so not authorized to modify a category.' })
      }

      Category.findById(categoryId)
        .then(category => {
          if (!category) {
            return res.status(404).json({ message: 'Category not found' })
          }

          // Redefine the category name, then save
          category.name = name
          return category.save()
        })
        .then(updatedCategory => {
          res.status(200).send(updatedCategory)
        })
        .catch(err => {
          next(err)
        })
    })
    .catch(err => {
      next(err)
    })
}

// Delete a category with its id
// Only the admin can do it
exports.deleteCategory = (req, res, next) => {
  const categoryId = req.params.id
  const connectedUserId = req.user.userId

  // Check if the user is connected
  User.findById(connectedUserId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Check if the user is admin
      if (!user.isAdmin) {
        return res.status(401).json({ message: 'You are not an admin, so not authorized to delete a category.' })
      }

      Category.findById(categoryId)
        .then(category => {
          if (!category) {
            return res.status(404).json({ message: 'Category not found' })
          }

          return Category.findByIdAndRemove(categoryId)
        })
        .then(deletedCategory => {
          if (!deletedCategory) {
            res.status(404).json({ message: 'Category not found' })
          } else {
            res.status(204).send()
          }
        })
        .catch(err => {
          next(err)
        })
    })
    .catch(err => {
      next(err)
    })
}
