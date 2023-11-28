'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const User = require('../models/user')

exports.login = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  console.log('foundUser', email, password)

  let foundUser
  User.findOne({ email })
    .then(user => {
    // if no user matches the given email
      if (!user) {
        const err = new Error('User not found')
        err.statusCode = 404
        throw err
      }
      foundUser = user
      console.log('foundUser', foundUser)
      return bcrypt.compare(password, user.password)
    })
    .then(valid => {
      if (!valid) {
        const err = new Error('Wrong password')
        err.statusCode = 401
        throw err
      }

      // Create the JWT token
      const token = jwt.sign(
        {
          email: foundUser.email,
          firstname: foundUser.firstname,
          lastname: foundUser.lastname,
          userId: foundUser._id.toString()
        },
        // Use the secret key that is in .env
        process.env.SECRET_JWT_TOKEN,
        { expiresIn: process.env.JWT_EXPIRATION }
      )
      res.status(200).json({ token })
    })
    .catch(err => {
      next(err)
    })
}

// Signup the user in the database
exports.signup = (req, res, next) => {
  const firstname = req.body.firstname
  const lastname = req.body.lastname
  const email = req.body.email
  const city = req.body.city
  const isAdmin = req.body.isAdmin
  const password = req.body.password

  // Encrypt the password
  bcrypt
    .hash(password, 10)
    .then((secretPassword) => {
      const user = new User({
        firstname,
        lastname,
        email,
        city,
        isAdmin,
        password: secretPassword
      })
      return user.save()
    })
    .then(result => {
      res.status(201).json({ message: 'User created', userId: result.id })
    })
    .catch(err => {
      next(err)
    })
}
