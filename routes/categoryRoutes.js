// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Product = require('../models/product');

// Read all categories with isdelete = false, sorted by order ascending
// router.get('/', async (req, res) => {
//   try {
//     const categories = await Category.find({ isdelete: false }).sort({ order: 1 });
//     // Thay vì render 'categories', hãy chỉ trả về JSON hoặc làm điều gì đó phù hợp với ứng dụng của bạn.
//     res.json(categories); // hoặc res.send(categories);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// Đổi tên route từ '/' thành '/list' để tránh xung đột với route '/add'
router.get('/list', async (req, res) => {
  try {
    const categories = await Category.find({ isdelete: false }).sort({ order: 1 });
    res.render('categories', { categories }); // render HTML thay vì trả về JSON
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read all products for a specific category
router.get('/:categoryId/products', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId, isdelete: false });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new category
// router.post('/', async (req, res) => {
//   try {
//     const newCategory = await Category.create(req.body);
//     res.status(201).json(newCategory);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
// Thay đổi route từ '/' thành '/list' để tránh xung đột với route '/add'
router.post('/list', async (req, res) => {
  try {
    const categories = await Category.find({ isdelete: false }).sort({ order: -1 });

    let newOrder = 1; // Giá trị mặc định nếu không có category nào trong danh sách
    if (categories && categories.length > 0) {
      newOrder = categories[0].order + 1;
    }

    const newCategory = await Category.create({
      name: req.body.name,
      order: newOrder,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Update category's name
// router.patch('/:id', async (req, res) => {
//   try {
//     const updatedCategory = await Category.findOneAndUpdate(
//       { _id: req.params.id },
//       { $set: { name: req.body.name } },
//       { new: true }
//     );
    
//     res.json(updatedCategory);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
router.patch('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { name: req.body.name } },
      { new: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Delete a category
// router.delete('/:id', async (req, res) => {
//   try {
//     await Category.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Category deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});





//Thục hiện
// Render add category page
router.get('/add', (req, res) => {
  res.render('addCategory');
});

// Thay đổi route từ '/' thành '/list' để tránh xung đột với route '/add'
router.post('/add', async (req, res) => {
  try {
    // Tạo một giá trị mặc định cho trường order nếu không được cung cấp
    const order = req.body.order || 0;

    const newCategory = await Category.create({
      name: req.body.name,
      order: order,
    });

    res.redirect('/categories/list'); // Đổi thành '/categories/list'
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Thêm route để hiển thị trang cập nhật
router.get('/update/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.render('updateCategory', { category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật thông tin category
router.post('/update/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: { name: req.body.name } },
      { new: true }
    );

    res.redirect('/categories/list');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Thêm route để hiển thị thông báo xác nhận xóa category
router.get('/delete/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.render('deleteCategory', { category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Xác nhận xóa category
router.post('/delete/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/categories/list');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



module.exports = router;
