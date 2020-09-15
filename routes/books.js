var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Author = require('../models/author');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var uploadPath = path.join('public',Book.coverImageBasePath);
var imageMimeTypes = ['image/jpeg', 'image/png' ,'images/gif' , 'images/jpg']
var upload = multer({
    dest : uploadPath ,
    fileFilter : (req , file , callback) =>{
        callback(null ,imageMimeTypes.includes(file.mimetype))
    }
});
// all Books route
router.get('/', async (req, res) => {
    let query = Book.find();

    if(req.query.title != null && req.query.title !=''){
        query = query.regex('title' , new RegExp(req.query
            .title , 'i'))
    }
    // query.lte()選擇的值field小於或等於<=
    if(req.query.publishBefore != null && req.query.publishBefore !=''){
        query = query.lte('publishDate' , req.query.publishBefore);
    }
    //query.gte()選擇的值field大於或等於（即>=）指定值
    if(req.query.publishAfter != null && req.query.publishAfter !=''){
        query = query.gte('publishDate' , req.query.publishAfter);
    }

    try{
        const books = await query.exec();
        res.render('books/index',{
            books : books ,
            searchOptions : req.query
        })
    }
    catch  {
         res.redirect('/');
    }

});

// new Book route
router.get('/new' , async (req , res) =>{
    renderNewPage(res , new Book());
});


// Create Book route
//upload.single('fieldName') : 接收單一上傳，fieldName為欄位名稱
router.post('/' ,upload.single('cover') , async (req , res) =>{
    const fileName = req.file !=null ? req.file.filename : null ;
    const book = new Book({
       title : req.body.title,
       author: req.body.author,
       publishDate: new Date(req.body.publishDate),
       pageCount: req.body.pageCount,
       coverImageName : fileName,
       description : req.body.description
    })
    try {
        const  newBook  = await  book.save();
        res.redirect(`books`);
    }
    catch {
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName);
        }
        renderNewPage(res , book , true );
    }

});

function removeBookCover(fileName){
    //刪除檔案
    fs.unlink(path.join(uploadPath , fileName) , err => {
        if(err) console.error((err));
    })
}

async  function renderNewPage(res , book , hasError = false){
    try {
        const authors = await Author.find({});
        const params = {
            authors : authors ,
            book : book
        }
        if(hasError) params.errorMessage = 'Error Creating';
        res.render('books/new', params);
    }
    catch {
        res.redirect('/books')
    }
}

module.exports = router;
