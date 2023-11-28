'use strict'

const Product = require('../models/product')

// Get a list of all of the products (sold and not sold)
exports.getProducts = (req, res, next) => {
  Product.find().sort({ title: 1 })
    .then(products => {
      res.status(200).json({
        products,
        pageTitle: 'All the products on the website'
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
    })
}

// Get the info of the /products/:id
exports.getProductId = (req, res, next) => {
  // Get the product ID from the URL
  const productId = req.params.id

  Product.findById(productId)
    .then(product => {
      if (!product) {
        // If no product found with the given ID, return an error response
        return res.status(404).json({ message: 'Product not found' })
      }

      res.status(200).json({
        product,
        pageTitle: `You are looking at the product with the ID ${productId}`
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: 'Internal server error' })
    })
}

// Get the products created by the userId entered in the url
exports.showUserProducts = (req, res, next) => {
  // Get the user ID from the URL
  const userId = req.params.userId

  Product.find({ userId })
    .then(products => {
      if (products.length === 0) {
        // If no products found with the given user ID, return an error response
        return res.status(404).json({ message: 'No products were found for this user' })
      }

      res.status(200).json({
        products,
        pageTitle: `You are looking at the products of the user with the ID ${userId}`
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: 'Internal server error' })
    })
}

// The connected user can create a new product
// His/her id will be associated with this new product
exports.createNewProduct = (req, res, next) => {
  const { title, description, price, imageUrl, categoryId } = req.body

  const product = new Product({
    title,
    description,
    price,
    imageUrl,
    categoryId,
    userId: req.user.userId
  })

  product.save()
    .then(result => {
      res.status(201).json({
        message: 'Your product is created',
        product: result
      })
    })
    .catch(err => {
      return res.status(422).json({
        errorMessage: err.errors
      })
    })
}

// The connected user can delete one of his/her products by putting the id in the url
exports.deleteProduct = (req, res, next) => {
  const productId = req.params.id
  const connectedUserId = req.user.userId

  // Find the product with the same id that is in the url
  Product.findById({ _id: productId })
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found ' })
      }

      // If the id associated with the product is not the same as the connected user's id, this means the user is not authorized
      if (product.userId.toString() !== connectedUserId) {
        return res.status(401).json({ message: 'You are not authorized to delete this product.' })
      }

      return Product.findByIdAndRemove(productId)
    })
    .then(deletedProduct => {
      if (!deletedProduct) {
        res.status(404).json({ message: 'Product not found' })
      } else {
        res.status(204).send()
      }
    })
    .catch(err => {
      next(err)
    })
}
