const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstname: {
    type: String,
    required: [true, 'A firstname is required.'],
    minlength: [3, 'The firstname must be at least 3 caracters.'],
    maxlength: [50, 'The firstname must be less than or equal to 50 caracters.']
  },
  lastname: {
    type: String,
    required: [true, 'A lastname is required.'],
    minlength: [3, 'The lastname must be at least 3 caracters.'],
    maxlength: [50, 'The lastname must be less than or equal to 50 caracters.']
  },
  email: {
    type: String,
    required: [true, 'The email is required.'],
    unique: [true, 'The email is already used. Find another one.'],
    maxlength: [50, 'The email must be less than or equal to 50 caracters.'],
    match: [/^\S+@\S+\.\S+$/, 'This is not an email.']
  },
  city: {
    type: String,
    required: [true, 'A city is required.'],
    maxlength: [50, 'The city must be less than or equal to 50 caracters.']
  },
  password: {
    type: String,
    required: [true, 'Please type a password, it is required.'],
    minlength: [6, 'The password must be at least 6 caracters.']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
},
{ timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
