const express = require('express')
const router = express.Router()

const cartController = require('../controllers/cartController')

const isConnected = require('../middleware/is-connected')

// Get the connected user's cart
router.get('/', isConnected, cartController.getUserCart)

// The connected user can add products to his/her cart
router.put('/', isConnected, cartController.addToCart)

// The connected user can delete products in his/her cart with the product's id in the url
router.delete('/:id', isConnected, cartController.deleteProductFromCart)

module.exports = router
