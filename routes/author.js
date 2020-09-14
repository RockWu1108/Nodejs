var express = require('express');
var router = express.Router();


// all author route
router.get('/', function(req, res) {
    res.render('authors/index');
});

// new Author route
router.get('/new' , (req , res) =>{
    res.render('authors/new')
});

router.post('/' , (req , res) =>{

    res.send('Create');
});

module.exports = router;
