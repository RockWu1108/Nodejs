var express = require('express');
var router = express.Router();
var Author = require('../models/author');
// all author route
router.get('/', async (req, res) => {
    let searchOptions = {}

    if(req.query.name !=null && req.query.name!==''){
        //flags = i 表示忽略大小寫
        searchOptions.name = new RegExp(req.query.name , 'i');
    }


    try {
        const authors = await  Author.find({name : searchOptions.name})

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

    try {
        const newAuthor = await author.save();
        res.redirect('authors');
    }
    catch{
            res.render('authors/new',{
                author : author,
                errorMessage : 'error creating'
            });
    }
});

module.exports = router;
