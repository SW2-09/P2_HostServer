export { workerRoute };

import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";

const workerRoute = express.Router();

import { checkLoggedIn } from "../config/authentication.js";

//User model
import { User } from "../models/User.js";

//login page
workerRoute.get("/login", checkLoggedIn, (req, res, next) => {
  const errors = req.flash().error || [];
  res.render("login", { errors });
});

//register page
workerRoute.get("/register", checkLoggedIn, (req, res) => {
  res.render("register");
});

//get data from DB
workerRoute.get("/updateDB", (req, res) => {
  User.findOne({ name: req.user.name })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => console.log(err));
});

//update compute value
workerRoute.post("/updateComputeDB", async (req, res) => {
  User.findOneAndUpdate(
    { name: req.user.name },
    { $set: { compute: !req.user.compute } }
  )
    .then((user) => {
      res.json({ message: "compute value changed" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error updating compute value" });
    });
});

//update tasks_computed value
workerRoute.post("/updateTasksComputedDB", async (req, res) => {
  User.findOneAndUpdate(
    { name: req.user.name },
    { $inc: { tasks_computed: 1 } }
  )
    .then((user) => {
      res.json({ message: "tasks_computed value changed" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error updating tasks_computed value" });
    });
});

//register handle
workerRoute.post("/register", (req, res) => {
  console.log(req.body);
  const { name, password, password2, compute } = req.body;
  let errors = [];
  console.log(req.body);

  if (!name || !password || !password2) {
    if (!name && !password && !password2) {
      errors.push({ msg: "Please enter all fields" });
    } else if (!name) {
      errors.push({ msg: "Please enter a name" });
    } else if (!password || !password2) {
      errors.push({ msg: "Please enter a password" });
    }
  } else if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  //Check if there is an error in the array
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      password,
      password2,
      compute,
    });
  } else {
    //validation passed
    console.log("validation passed");
    User.findOne({ name: name }).then((user) => {
      if (user) {
        //User exists
        errors.push({ msg: "User is taken" });
        res.render("register", {
          errors: errors,
          name: name,
          password: password,
          password2: password2,
          compute: compute,
        });
      } else {
        const newUser = new User({
          name: name,
          password: password,
          compute: req.body.checkboxYes !== undefined,
          tasks_computed: 0,
        });

        //Check the hashed password. Default function
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                res.redirect("/worker/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

//Login handle
workerRoute.post("/login", (req, res, next) => {
  console.log(req.body);
  passport.authenticate("local", {
    failureFlash: true,
    successRedirect: "/worker",
    failureRedirect: "/worker/login",
  })(req, res, next);
});

//Logout handle
workerRoute.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
