// routes/users.js


var express = require('express');
const { model } = require('mongoose');
const { use } = require('.');
var router = express.Router();
var responseData = require('../helper/responseData');
var modelUser = require('../models/user')
var validate = require('../validates/user')
const {validationResult} = require('express-validator');


router.get('/list', async function (req, res, next) {
  try {
    var usersAll = await modelUser.getall(req.query);
    res.render('users', { data: usersAll });
  } catch (error) {
    responseData.responseReturn(res, 500, false, "Lỗi khi lấy danh sách người dùng");
  }
});
// router.get('/', async function (req, res, next) {
//   try {
//     console.log(req.query);
//     var usersAll = await modelUser.getall(req.query);

//     console.log(usersAll); // Log dữ liệu để kiểm tra

//     // Kiểm tra xem usersAll.data có tồn tại và là một mảng không
//     if (usersAll.data && Array.isArray(usersAll.data)) {
//       // Loại bỏ thông tin mật khẩu từ mỗi người dùng
//       const usersWithoutPasswords = usersAll.data.map(user => ({ _id: user._id, userName: user.userName }));
//       responseData.responseReturn(res, 200, true, usersWithoutPasswords);
//     } else {
//       responseData.responseReturn(res, 404, false, "Không có người dùng nào");
//     }
//   } catch (error) {
//     console.error(error);
//     responseData.responseReturn(res, 500, false, "Lỗi khi lấy danh sách người dùng");
//   }
// });




router.get('/:id', async function (req, res, next) {// get by ID
  try {
    var user = await modelUser.getOne(req.params.id);
    responseData.responseReturn(res, 200, true, user);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay user");
  }
});
router.post('/add',validate.validator(),
  async function (req, res, next) {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
      responseData.responseReturn(res, 400, false, errors.array().map(error=>error.msg));
      return;
    }
  var user = await modelUser.getByName(req.body.userName);
  if (user) {
    responseData.responseReturn(res, 404, false, "user da ton tai");
  } else {
   
    const newUser = await modelUser.createUser({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      department_k:req.body.department_k
    })
    
    responseData.responseReturn(res, 200, true, newUser);
  }
});
router.put('/edit/:id', async function (req, res, next) {
  try {
    var user = await modelUser.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    responseData.responseReturn(res, 200, true, user);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay user");
  }
});
router.delete('/delete/:id', function (req, res, next) {//delete by Id
  try {
    var user = modelUser.findByIdAndDelete(req.params.id);
    responseData.responseReturn(res, 200, true, "xoa thanh cong");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay user");
  }
});






module.exports = router;
