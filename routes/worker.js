export {workerRoute}

import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs"

const workerRoute = express.Router();

import { checkLoggedIn } from "../config/authentication.js";

//User model
import { User } from "../models/User.js";


//login page
workerRoute.get('/login', checkLoggedIn,(req,res,next) => {
  const errors = req.flash().error || [];
  res.render("login", { errors });
})

//register page
workerRoute.get('/register', checkLoggedIn,(req,res) => {
  res.render('register'); 
})

//
workerRoute.get('/updateDB', (req,res) => {
  console.log("lav Noget")
  res.json({
    tasks_computed: req.user.tasks_computed,
    compute: req.user.compute,

})})


//register handle
workerRoute.post('/register', (req,res) =>{ console.log(req.body)
  const {name, password, password2, compute} = req.body;
  let errors = [];
  console.log(req.body)

  //Check required fiels
  if(!name && !password && !password2) {
   errors.push({msg: 'Please enter a username and password'});
  }

  //Require username
  if(!name) {
    errors.push({msg: 'Please enter a username'});
   } 

  //Check password match
  if(name && password != password2){
       errors.push({msg: 'Passwords do not match'});
  }

  //Check if there is an error in the array
  if(errors.length > 0){
   remember_if_yes
    res.render('register',{
       errors, 
       name,
       password,
       password2,
       compute

    });
  } else{
   //validation passed
      console.log('validation passed')
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
                   compute: compute
                });
           } else{
               const newUser = new User ({
                   name: name,
                   password: password,
                   compute: req.body.checkboxYes !== undefined,
                   tasks_computed: 0
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
      failureFlash: true,
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

