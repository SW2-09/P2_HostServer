/* ** NOTES **
1. Use the "npm init" command to create a package.json file 
2. "npm install --save-dev nodemon" command to install nodemon (see package.json)
3. Use the "npm run devStart" command to start the server (see package.json) 
nodemon can be acti
*/

const port = 8080;

import express from "express";
import expressLayouts from "express-ejs-layouts";
import mongoose from "mongoose";
import mongoDBStore from "connect-mongodb-session";
import passport from "passport";
import session from "express-session";
import flash from "connect-flash";
import status from "express-status-monitor";

const app = express();
app.use(status());

app.use(express.static("public")); // Middleware function that serves static files (e.g. css files) https://expressjs.com/en/starter/static-files.html
app.use(express.json()); // This allows us to parse json data

//User model
import { User } from "./models/User.js";

//passport config
import { checkPassport } from "./config/passport.js";
checkPassport(passport);

//MongoDB Atlas config
import { MongoURI as db } from "./config/keys.js";
import { sessionsURI } from "./config/keys.js";

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.log(err));

//Connect to MongoDB sessions
const sessiontStore = mongoDBStore(session);
const store = new sessiontStore({
    uri: sessionsURI,
    collection: "Hostserver",
});

//EJS setup
app.use(expressLayouts);
app.set("view engine", "ejs"); // Makes .ejs files possible to use
app.use(flash());

//Express session
app.use(
    session({
        name: "Hostserver",
        secret: "HostSecret",
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
    })
);

//Bodyparser
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Index page
import { router as router } from "./routes/index.js";
app.use("/", router);

//Worker page
import { workerRoute as workerRoute } from "./routes/worker.js";
app.use("/worker", workerRoute);

app.listen(port, () =>
    console.log(`Server has been started on http://localhost:${port}`)
);
