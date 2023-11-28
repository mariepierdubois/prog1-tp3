const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController')

const isConnected = require('../middleware/is-connected')

// Returns the list of all products, sold and not sold
router.get('/', productController.getProducts)

// Return the products of the user whose id is in the url
router.get('/:id', productController.getProductId)

// To create a new product
router.post('/', isConnected, productController.createNewProduct)

// Return all of the products of the user whose id is in the url
router.get('/user/:userId', productController.showUserProducts)

// Delete the product which id is in the url
router.delete('/:id', isConnected, productController.deleteProduct)

module.exports = router
