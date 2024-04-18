// models/category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  isdelete: {
    type: Boolean,
    default: false,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
