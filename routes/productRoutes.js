// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category'); // Thêm dòng này để import module Category

// Read all products with isdelete = false, sorted by order ascending
// router.get('/', async (req, res) => {
//   try {
//     const products = await Product.find({ isdelete: false }).sort({ order: 1 });
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.get('/list', async (req, res) => {
  try {
    const products = await Product.find({ isdelete: false })
      .sort({ order: 1 })
      .populate('category'); // Populate dữ liệu từ bảng Category
    res.render('products', { products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new product
// router.post('/', async (req, res) => {
//   try {
//     const newProduct = await Product.create(req.body);
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
// Thêm route để hiển thị trang thêm mới sản phẩm với danh sách thể loại
router.get('/add', async (req, res) => {
  try {
    const categories = await Category.find({ isdelete: false }).sort({ order: 1 });
    res.render('addProduct', { categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Cung cấp route cho form thêm mới sản phẩm
router.post('/add', async (req, res) => {
  try {
    // Lấy thông tin sản phẩm từ req.body
    const { name, description, price, category } = req.body;

    // Tạo mới sản phẩm với thông tin đã lấy được
    const newProduct = await Product.create({
      name,
      description,
      price,
      category, // ID của thể loại
    });

    // Sau khi thêm mới thành công, chuyển hướng về trang danh sách sản phẩm
    res.redirect('/products/list');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Update product's properties
// router.patch('/:id', async (req, res) => {
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
router.get('/update/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find({ isdelete: false }).sort({ order: 1 });
    res.render('updateProduct', { product, categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.patch('/update/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post('/update/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    // Sử dụng res.redirect để chuyển hướng sau khi cập nhật
    res.redirect('/products/list');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// ...



// Delete a product
// router.delete('/:id', async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
router.get('/delete/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('deleteProduct', { product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




// Xác nhận xóa product
router.post('/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products/list');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
