'use strict'

const User = require('../models/user')
const Product = require('../models/product')

// Get a list of all the products in the connected user's cart
exports.getUserCart = (req, res, next) => {
  const connectedUserId = req.user.userId

  // Find the connected user in the users collection
  User.findById(connectedUserId, { cart: 1 })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      if (user.cart.length === 0) {
        return res.status(404).json({ message: 'Your cart is empty.' })
      }

      // Return only the ids of the products in the cart
      res.status(200).json({
        cart: user.cart.map(product => product._id),
        pageTitle: 'This is your cart.'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(err.statusCode || 500).json({ error: err.message })
    })
}

// Add a product in the connected user's cart
exports.addToCart = (req, res, next) => {
  const connectedUserId = req.user.userId
  const productId = req.body.productId

  // Find the connected user in the users collection
  User.findById(connectedUserId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Then find the product id that is in the url in the products collection
      Product.findById(productId)
        .then(product => {
          if (!product) {
            return res.status(404).json({ message: 'Product not found' })
          }

          // The user can't put a sold product in his/her cart
          if (product.isSold) {
            return res.status(400).json({ message: 'Product is already sold' })
          }

          // Set the isSold property of the product to true
          product.isSold = true

          // Add the product to the user's cart
          user.cart.push(product)

          // Save the changes to the user and the product
          return Promise.all([user.save(), product.save()])
        })
        .then(([updatedUserCart, productSold]) => {
          res.status(200).json({
            message: 'Product added to cart successfully',
            updatedUserCart: user.cart.map(product => product._id),
            productSold: productSold.isSold
          })
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({ error: 'An error occurred while adding the product to cart' })
        })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: 'An error occurred while fetching user information' })
    })
}

// Delete a product from the cart
// By the connected user
exports.deleteProductFromCart = (req, res, next) => {
  const connectedUserId = req.user.userId
  const productId = req.params.id

  // Find the connected user in the users collection
  User.findById(connectedUserId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Find the index of the product we put in the url in the user's cart
      const productIndex = user.cart.findIndex(prod => prod.toString() === productId)
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' })
      }

      return Product.findById(productId)
        .then(product => {
          // Update the product's isSold property to false
          product.isSold = false
          return product.save()
        })
        .then(() => {
          // Remove the product from the user's cart
          user.cart.splice(productIndex, 1)
          return user.save()
        })
    })
    .then(updatedUser => {
      res.status(204).json({
        message: 'Product removed from cart successfully',
        updatedUser
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: 'An error occurred while removing the product from cart' })
    })
}
