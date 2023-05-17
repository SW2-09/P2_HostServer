export { checkPassport };

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Strategy as localStrategy } from "passport-local";

//Load user model
import { User } from "../models/User.js";

/**
 * Sets up passport with local strategy for authentication
 * and configures serializing and deserializing of users.
 * The function is inspired by documentation from passport website.
 *
 * @param {object} passport - The passport object for authentication.
 */
function checkPassport(passport) {
    passport.use(
        new localStrategy(
            { passReqToCallback: true, usernameField: "name" },
            (req, name, password, done) => {
                //Match User
                User.findOne({ name: name })
                    .then((user) => {
                        if (!user) {
                            return done(
                                null,
                                false,
                                req.flash("error", "User not found")
                            );
                        }

                        //Match password
                        bcrypt.compare(
                            password,
                            user.password,
                            (err, isMatch) => {
                                if (err) throw err;
                                if (isMatch) {
                                    return done(null, user);
                                } else {
                                    return done(
                                        null,
                                        false,
                                        req.flash("error", "Wrong password")
                                    );
                                }
                            }
                        );
                    })
                    .catch((err) => console.log(err));
            }
        )
    );

    //Taken from passport website
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}
