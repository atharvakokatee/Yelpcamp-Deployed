const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const methodOverride = require('method-override');
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index'); 

const port = process.env.PORT || 3000;

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());

// setup mongoose
// let mongoDB = 'mongodb://localhost/my_shoe';
// let mongoDB = 'mongodb+srv://shaggy:shaggy@cluster0-txaxf.mongodb.net/test?retryWrites=true&w=majority';
let mongoDB = 'mongodb+srv://shaggy:shaggy@cluster0-6jseq.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true,useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Passport Config
app.use(require('express-session')({
    secret: "Hail Hitler",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// seedDB();

app.use('/',indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);

app.listen(port, ()=>{
    console.log('Yelpcamp server has started...');
});