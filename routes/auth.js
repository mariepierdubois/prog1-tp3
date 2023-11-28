'use strict'

const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')

// Router to login
router.post('/login', authController.login)

// Router to signup
router.post('/signup', authController.signup)

module.exports = router
