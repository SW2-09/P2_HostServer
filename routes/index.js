export {router}

import express from "express"
import passport from "passport";
import { ensureAuthenticated, checkLoggedIn } from "../config/authentication.js";

const router = express.Router();


router.get('/',checkLoggedIn, (req, res) =>{
    res.render('welcome')
})


router.get('/worker',ensureAuthenticated, (req, res) =>{
    res.render('worker',{
        name: req.user.name,
        tasks_computed: req.user.tasks_computed,
        compute: req.user.compute,
    })
})
