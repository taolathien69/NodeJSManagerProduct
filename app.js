//app.js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var itemsRouter = require('./routes/items');
var authenRouter = require('./routes/authen');
var departmentsRouter = require('./routes/departments');


var productRoutes = require('./routes/productRoutes');  
var categoryRoutes = require('./routes/categoryRoutes');  



var app = express();


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items',itemsRouter);
app.use('/authen',authenRouter);
app.use('/departments',departmentsRouter);

mongoose.connect("mongodb://127.0.0.1:27017/S6Final");
mongoose.connection.once('open', function(){
  console.log("ket noi thanh cong");
});
mongoose.connection.on('error', function(){
  console.log("ket noi khong thanh cong");
});








// Đặt đoạn này trước catch 404

app.use('/products', productRoutes);  // Thêm dòng này
app.use('/categories', categoryRoutes);  // Thêm dòng này

app.get('/login', function(req, res, next) {
  res.render('login');
});
app.get('/forgotpassword', function(req, res, next) {
  res.render('forgotpassword');
});
app.get('/resetpassword', function(req, res, next) {
  res.render('resetpassword');
});

app.post('/login', async function (req, res, next) {
  try {
    // Thêm logic xử lý đăng nhập ở đây
    // Ví dụ: kiểm tra thông tin đăng nhập, xác minh người dùng

    // Lấy thông tin người dùng từ database hoặc nơi khác
    const user = await modelUser.getUserByUsername(req.body.userName);

    if (user) {
      // Sau khi đăng nhập thành công, render trang users
      res.render('users', { user: user });
    } else {
      // Xử lý trường hợp không tìm thấy người dùng
      res.render('login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
  } catch (error) {
    // Xử lý lỗi nếu cần thiết
    console.error(error);
    res.render('login', { error: error }); // Render trang login với thông báo lỗi nếu có
  }
});



var modelUser = require('./models/user'); // Import modelUser (đảm bảo đường dẫn đúng)
// Định nghĩa options ở đây hoặc truyền từ một module khác
var options = {
  roles: ['admin', 'user', 'publisher']
};

app.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register', options: options });
});


app.post('/register', async function(req, res, next) {
  try {
    // Thêm logic xử lý đăng ký ở đây
    // Ví dụ:
    const newUser = await modelUser.createUser({/* Thông tin người dùng mới */});

    // Sau khi đăng ký thành công, chuyển hướng đến trang /users
    res.redirect('/users');
  } catch (error) {
    // Xử lý lỗi nếu cần thiết
    console.error(error);
    res.redirect('/login'); // Chuyển hướng về trang đăng nhập nếu có lỗi
  }
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
