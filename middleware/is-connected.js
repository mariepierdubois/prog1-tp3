'use strict'

const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization') // gets the authorization header
  console.log('authorization header: ', authHeader)

  if (!authHeader) {
    res.status(401).json({ err: 'Not authenticated.' })
    // if there's no auth. header, then error
  }

  const token = authHeader.split(' ')[1]
  let decodedToken

  try {
    // is the decoded token the same as the secret JWT token
    decodedToken = jwt.verify(token, process.env.SECRET_JWT_TOKEN)
  } catch (err) {
    err.statusCode = 401
    throw err
  }

  // if there is no decoded token
  if (!decodedToken) {
    const err = new Error('Non authenticated!')
    err.statusCode(401)
    throw err
  }

  // We can use req.user globally
  req.user = decodedToken
  console.log('decodedToken', decodedToken)
  next()
}
