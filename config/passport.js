const localStr = require('passport-local').Strategy;
const mongoose =require('mongoose');
const bcrypt =require('bcryptjs');
const passport = require('passport');
const User =require('../models/User');




module.exports=function(passport){




    passport.use(new localStr({usernameField:'email'},(email, password, done) => {
          User.findOne({ email: email })
          .then(  user => {
            //match user
            if (!user) {
              return done(null, false, { message: 'User deoesnt exsit' });
            }// end of !USER
            //match password
             
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        console.log('here')
                        return done(null,user);
                    }else{
                        return done(null, false, { message: 'Incorrect Password.' });

                    }//end of is match 
                });//end of bcrypt

          
          })//end of then
          .catch(err=>{
              console.log(err)
          });
        }//end of arrow func
      ));//end of pass.use

      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

};//end of module
