// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Tham chiếu đến model Category
  },
  isdelete: {
    type: Boolean,
    default: false,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
