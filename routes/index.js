
var express = require('express');
var router = express.Router();
var Book = require('../models/book');

/* GET home page. */
router.get('/', async function(req, res, next) {

    let query  =  Book.find();
  try {

    // sort降序 ， limit()限制回傳10筆
    const books = await query.sort({createAt : 'desc'}).exec();
    //books =await Book.find().sort({createdAt : 'desc'}).limit(10).exec();
    res.render('index' , {
      books : books
    });
  }
  catch (e) {
    query =[];
    console.error(e);
  }



});

module.exports = router;
