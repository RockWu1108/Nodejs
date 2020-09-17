var express = require('express');
var router = express.Router();
var Author = require('../models/author');
var Book = require('../models/book');
// all author route
router.get('/', async (req, res) => {
    let searchOptions = {}

    if(req.query.name !=null && req.query.name!==''){
        //flags = i 表示忽略大小寫
        searchOptions.name = new RegExp(req.query.name , 'i');
    }


    try {
        const authors = await  Author.find(searchOptions)
        res.render('authors/index', {
                authors: authors,
                searchOptions: req.query

            });
    }
    catch (e) {
        res.redirect('/');
    }
});

// new Author route
router.get('/new' , (req , res) =>{
    res.render('authors/new' , {author: new Author()});
});

router.post('/' , async (req , res) =>{

    const author = new Author({
        name : req.body.name
    });
        console.log("author"+author);
    try {
        const newAuthor = await author.save();
        //res.redirect('authors');
        res.redirect(`authors/${newAuthor.id}`);

    }
    catch{

            res.render('authors/new',{
                author : author,
                errorMessage : 'error creating'
            });

    }

});

router.get('/:id' , async (req , res) =>{

    try {
        const author = await Author.findById(req.params.id);
        const books = await  Book.find({author :author.id}).limit(10).exec();
        res.render("authors/show" ,
            {
                author : author ,
                booksByAuthor : books
            });

    }
    catch (e) {
        console.log(e);
        res.redirect('/');
    }

});




router.get('/:id/edit' , async (req , res) =>{
    try{
        const author = await Author.findById(req.params.id);
        res.render("authors/edit" , {author : author});
    }
    catch (e) {
        res.render("/authors");
    }
});

router.put('/:id' , async (req , res) =>{

    let author;
    try {

        author = await Author.findById(req.params.id);
        console.log("Author : "+ author);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);

    }
    catch{
        if(author == null){

            res.redirect('/');
        }
        else{

            res.render('authors/edit',{
                author : author,
                errorMessage : 'Edit updating error '
            });
        }


    }
});

router.delete('/:id' , async (req , res) =>{

    let author;
    try {

        author = await Author.findById(req.params.id);
        console.log("Author : "+ author);
        await author.remove();
        res.redirect('/authors');

    }
    catch{
        if(author == null){

            //回主頁面
            res.redirect('/');
        }
        else{

            res.render(`/authors/${author.id}`);
        }


    }
});

module.exports = router;
