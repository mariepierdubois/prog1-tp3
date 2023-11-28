const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'A category name is required.'],
    maxlength: [50, 'This category name must be less than or equal to 50 caracters.']
  }
})

module.exports = mongoose.model('Category', categorySchema)
