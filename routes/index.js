export { router };

import express from "express";
import passport from "passport";
import {
    ensureAuthenticated,
    checkLoggedIn,
} from "../config/authentication.js";
import { sanitize } from "../utility.js";

const router = express.Router();

router.get("/", checkLoggedIn, (req, res) => {
    res.render("welcome");
});

router.get("/worker", ensureAuthenticated, (req, res) => {
    const name = sanitize(req.user.name);
    const tasks_computed = req.user.tasks_computed;
    res.render("worker", {
        name: name,
        tasks_computed: tasks_computed,
        compute: req.user.compute,
    });
});
