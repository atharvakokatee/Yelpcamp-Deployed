const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const middleware = require('../middleware');

router.get('/', (req,res)=>{
    Campground.find({},(err, foundCampgrounds)=>{
        if(err){
            req.flash('error',"Couldn't find Campgrounds");
            res.redirect('back');
        } else{
            res.render('campgrounds/campgrounds',{campgrounds:foundCampgrounds});
        }
    });
});

router.post('/', middleware.isLoggedIn,(req,res)=>{
    let name = req.body.name;
    let image = req.body.image;
    let price = String(req.body.price);
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };    
    let newCampground = {name:name,image:image,price:price,description:desc,author:author};
    Campground.create(newCampground,(err,newlyCreated)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect('/campgrounds');
            console.log(newlyCreated);
        }
    });
});

router.get('/new', middleware.isLoggedIn,(req,res)=>{
    res.render('campgrounds/new');
});

router.get('/:id',(req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        } else{
            // console.log(foundCampground);
            res.render('campgrounds/show',{campground:foundCampground});
        }
    });
});

router.get('/:id/edit',middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render('campgrounds/edit',{campground:foundCampground});
        }
    });
});

router.put('/:id',middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,req.body.Campground,function(err,campground){
        if(err){
            console.log(err);
        } else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

router.delete('/:id',middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;
