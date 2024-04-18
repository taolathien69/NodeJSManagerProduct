// routes/index.js
var express = require('express');
var router = express.Router();

//localhost:3000/

/* GET home page. */
router.get('/', function(req, res, next) {//get all
  res.render('login', { title: 'Express' });
});
router.get('/index1', function(req, res, next) {//get all
  res.render('index1', { title: 'Express' });
});

module.exports = router;
