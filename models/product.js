const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  title: {
    type: String,
    required: [true, 'A title is required.'],
    maxlength: [50, 'This title must be less than or equal to 50 caracters.']
  },
  description: {
    type: String,
    required: [true, 'A description is required.'],
    maxlength: [255, 'This description must be less than or equal to 255 caracters.']
  },
  price: {
    type: Number,
    required: [true, 'A price is required.'],
    validate: {
      validator: function (thePrice) {
        return Number.isInteger(thePrice) && thePrice >= 0
      },
      message: 'The price is not set correctly. It must be an integer and in cents.'
    },
    set: function (thePrice) {
      return Math.round(thePrice * 100) // from $$ to cents
    },
    get: function (thePrice) {
      return (thePrice / 100).toFixed(2) // to come back to $$ with decimals
    }
  },
  imageUrl: {
    type: [
      {
        type: String,
        required: [true, 'At least one URL is required.'],
        maxlength: [255, 'Your URL cannot be more than 255 caracters.']
      }
    ]
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isSold: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Product', productSchema)
