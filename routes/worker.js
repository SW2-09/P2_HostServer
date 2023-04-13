export {workerRoute}

import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs"

const workerRoute = express.Router();

import { checkLoggedIn } from "../config/authentication.js";

//User model
import { User } from "../models/User.js";


//login page
workerRoute.get('/login', checkLoggedIn,(req,res)=>{
  res.render("login");
})

//register page
workerRoute.get('/register', checkLoggedIn,(req,res)=>{
  res.render('register');
})

//register handle
workerRoute.post('/register', (req,res) =>{
  const {name, password, password2, tasks_computed} = req.body;
  let errors = [];

  //Check required fiels
  if(!name && !password && !password2) {
   errors.push({msg: 'Please enter a username and password'});
  }

  //Require username
  if(!name && password && password2) {
    errors.push({msg: 'Please enter a username'});
   }
 

  //Check password match
  if(name && password != password2){
       errors.push({msg: 'Passwords do not match'});
  }

  //Check if there is an error in the array
  if(errors.length > 0){
    res.render('register',{
       errors, 
       name,
       password,
       password2,
       tasks_computed
    });
  } else{
   //validation passed
      User.findOne({name: name})
      .then(user =>{
           if(user){
               //User exists
               errors.push({msg: 'User is taken'});
               res.render('register',{
                   errors: errors, 
                   name: name,
                   password: password,
                   password2: password2,
                   tasks_computed: tasks_computed
                });
           } else{
               const newUser = new User ({
                   name: name,
                   password: password,
                   tasks_computed: tasks_computed 
               });

               //Check the hashed password. Default function
               bcrypt.genSalt(10, (err, salt) => {
                   bcrypt.hash(newUser.password, salt, (err, hash) => {
                     if (err) throw err;
                     newUser.password = hash;
                     newUser
                       .save()
                       .then(user => {
                         res.redirect('/worker/login');
                       })
                       .catch(err => console.log(err));
                   });
                 });
           }          
      })
  }
  
})

//Login handle
workerRoute.post('/login',(req,res,next)=>{
  console.log(req.body)
  passport.authenticate('local',{
      successRedirect: '/worker',
      failureRedirect: '/worker/login'
  })(req, res, next);
})

//Logout handle
workerRoute.get('/logout', (req, res) =>{
  req.logout( err => {
      if(err) { return next(err) }
      res.redirect('/')
      })
    })