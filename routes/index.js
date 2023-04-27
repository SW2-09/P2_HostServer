export { router };

import express from "express";
import passport from "passport";
import { sanitize } from "../config/utility.js";
import {
    ensureAuthenticated,
    checkLoggedIn,
} from "../config/authentication.js";

const router = express.Router();

router.get("/", checkLoggedIn, (req, res) => {
    res.render("welcome");
});

router.get("/worker", ensureAuthenticated, (req, res) => {
    const name = sanitize(req.user.name);
    res.render("worker", {
        name: name,
        tasks_computed: req.user.tasks_computed,
        compute: req.user.compute,
    });
});
