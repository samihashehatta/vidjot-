const express =require('express');
const router = express.Router();
// const Idea =require('../models/Idea');
const User=require('../models/User');
const bcrypt =require('bcryptjs');
const passport =require('passport');
const {ensureAuth} =require('../helpers/auth');

// log in
router.get('/login',(req,res)=>{
    res.render('users/login')
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect:'/ideas',
      failureRedirect: '/users/login',
      failureFlash:true
    })(req, res, next);
  })
//register

router.get('/register',(req,res)=>{
    res.render('users/register')
});
router.post('/register',(req,res)=>{
    let errors=[];
    if(req.body.password !== req.body.password2 )
    {
        errors.push({text:'password doesnt match'})
    };
    if(req.body.password.length < 4 )
    {
        errors.push({text:'password is less than 4 charceters it must be more'});

    };
    if(errors.length > 0){
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        })
    }else{
        User.findOne({email:req.body.email})
        .then(user =>{
            if(user){
              req.flash('err_msg','email is already registered');
              res.redirect('/users/login')  ;
            }else{

          
        const newUser ={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
        };
         bcrypt.genSalt(10,(err,salt)=>{
             bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err){
                    req.flash('err_msg',err);
                    res.redirect('/');
                }
                newUser.password=hash;
                new User(newUser)
                .save()
                .then(user=>{
                    console.log(user)
                    req.flash('su_msg','welcome on board whoooo');
                    res.redirect('/users/login')
                })
                .catch(err=>{
                    req.flash('err_msg',err)
                    res.redirect('/');
                })
                
                ;
             });
             
             if(err){
                 req.flash('err_msg',err);
                 res.redirect('/');
             }
         })
        }
    })
        }
        
});


// logout route 

router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('su_msg','you are logged out');
    res.redirect('/');
});




module.exports = router;