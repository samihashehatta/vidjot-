const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const flash =require('connect-flash');
const session =require('express-session');
const port = 3000;
const ideasRoutes = require('./routes/ideas');
const usersRoutes =require('./routes/users');
const passport =require('passport');
const config =require('./config/passport');
const app = express();


 

app.use(express.static(path.join(`${__dirname}/public`)));

// connecting to mongodb
mongoose.set('debug' , true);
mongoose.connect('mongodb://localhost/vidjot',{useNewUrlParser: true })
.then(()=>console.log('connectes'))
.catch(err=>req.flash('err_msg',err))
;

// loading idea 
Idea = require('./models/Idea')
//middleware for hnadlebars 
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 // override 
app.use(methodOverride('_method'))
//sessions
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'cat',
  resave: true,
  saveUninitialized: true,
}));
//passport middleware 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global vars 
app.use(function(req,res,next){
    res.locals.su_msg = req.flash('su_msg');
    res.locals.err_msg = req.flash('err_msg');
    res.locals.error = req.flash('error');
    res.locals.user=req.user || null;
    next();
});
app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/about',(req,res)=>{
    res.render('about');
});

require('./config/passport')(passport);
app.use('/ideas',ideasRoutes);
app.use('/users',usersRoutes);
app.listen(port,()=>{
console.log('app is conceted ');
});
