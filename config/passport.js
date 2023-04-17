export {checkPassport}

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
import { Strategy as localStrategy } from 'passport-local';

//Load user model
import { User } from '../models/User.js';

//Taken from passport website 
function checkPassport(passport) {
    passport.use(
        new localStrategy({usernameField: 'name'}, (name, password, done) =>{
            //Match User
            User.findOne({name: name})
            .then(user => {
                if(!user){
                    return done(null, false, {msg: 'That name is username is not registrered'});
                }

                //Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                      return done(null, user);
                    } else {
                      return done(null, false, {msg: 'Password incorrect' });
                    }
                  });
            })
            .catch(err => console.log(err));
        })

    )

    //Taken from passport website
    passport.serializeUser((user, done) =>{
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
          const user = await User.findById(id);
          done(null, user);
        } catch (err) {
          done(err);
        }
      });
      
}