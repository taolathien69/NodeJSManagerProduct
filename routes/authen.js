// routes/authen.js
var express = require('express');
const { model } = require('mongoose');
const { use } = require('.');
var router = express.Router();
var responseData = require('../helper/responseData');
var modelUser = require('../models/user')
var validate = require('../validates/user')
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const configs = require('../helper/configs');
const sendmail = require('../helper/sendmail');
var protect = require('../middlewares/protectLogin')
const { checkLogin } = require('../middlewares/protect');
var userModel = require('../schema/user')
let resHandle = require('../helper/resHandle')

router.post('/register', validate.validator(),
  async function (req, res, next) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      responseData.responseReturn(res, 400, false, errors.array().map(error => error.msg));
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
      })
      //responseData.responseReturn(res, 200, true, '/login');
      res.redirect('/login');
     
      
    }
  });
  
router.post('/login', async function (req, res, next) {
  var result = await modelUser.login(req.body.userName, req.body.password);
  if(result.err){
    responseData.responseReturn(res, 400, true, result.err);
    return;
  }
  console.log(result);
  var token = result.getJWT();
  res.cookie('tokenJWT',token,{
    expires:new Date(Date.now()+2*24*3600*1000),
    httpOnly:true
  });
 // responseData.responseReturn(res, 200, true, token);
 res.redirect('/index1');
});
router.post('/changepassword', protect, async function (req, res, next) {
  let result = bcrypt.compareSync(req.body.oldpassword, req.user.password);
  if (result) {
    let user = req.user;
    user.password = req.body.newpassword;
    await user.save();
    resHandle(res, true, "doi pass thanh cong");
  } else {
    resHandle(res, false, "password khong dung");
  }

})


router.get('/logout', async function(req, res, next){
  res.cookie('tokenJWT', 'none', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true
  });
  responseData.responseReturn(res, 200, true, 'Logout thành công');
  res.redirect('/login');
});


router.get('/me', async function(req, res, next){
  var result = await checkLogin(req);
  if(result.err){
    responseData.responseReturn(res, 400, true, result.err);
    return;
  }
  console.log(result);
  req.userID = result;
  next();
},
// async function(req, res, next){
//   var user = await modelUser.getOne(req.userID);
//   var role = user.role;
//   console.log(role);
//   var DSRole = ['admin','publisher'];
//   if(DSRole.includes(role)){
//     next();
//   }
//   else{
//     responseData.responseReturn(res, 403, true,"ban khong du quyen");
//   }
// },
 async function (req, res, next) {//get all
  var user = await modelUser.getOne(req.userID);
  res.send({ "done": user});
});

router.post('/forgotpassword', async function (req, res, next) {
  let email = req.body.email;
  let user = await userModel.findOne({ email: email });
  if (!user) {
    resHandle(res, false, "email chua ton tai trong he thong")
    return;
  }
  let token = user.genResetPassword();
  await user.save();
  //let url = `http://localhost:3000/api/v1/auth/resetpassword/${token}`
  //doi link sang form nham passsword
  //link post dc gan vao  button
  try {
    await sendmail(user.email, url);
    resHandle(res, true, "gui mail thanh cong");
  } catch (error) {
    user.tokenResetPasswordExp = undefined;
    user.tokenResetPassword = undefined;
    await user.save();
    resHandle(res, false, error);
  }
});

router.post('/resetpassword/:token', async function (req, res, next) {
  let user = await userModel.findOne({
    tokenResetPassword: req.params.token
  })
  if (!user) {
    resHandle(res, false, "URL khong hop le");
    return;
  }
  if (user.tokenResetPasswordExp > Date.now()) {
    user.password = req.body.password;
    user.tokenResetPasswordExp = undefined;
    user.tokenResetPassword = undefined;
    await user.save();
    resHandle(res, true, "doi mat khau thanh cong");
  } else {
    resHandle(res, false, "URL khong hop le");
    return;
  }

});

module.exports = router;
