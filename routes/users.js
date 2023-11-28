const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

const isConnected = require('../middleware/is-connected')

// Return the users list, without email and password
router.get('/', userController.getUsers)

// Return the connected user's profile
router.get('/profil', isConnected, userController.getUserProfile)

// Return the infos of the user's id in the url
router.get('/:id', userController.getUserId)

// Update the connected user's profile
router.put('/:id', isConnected, userController.putUserId)

// Delete the connected user's profile
router.delete('/:id', isConnected, userController.deleteUserId)

module.exports = router
