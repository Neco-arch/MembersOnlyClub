require('dotenv').config()
const express = require("express")
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const MemberRouter = require('./routes/newmember')
const pgSession = require('connect-pg-simple')(session);
const path = require('node:path')

// Initialize express
const app = express()


// Defualt Config
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));


// Router

app.use("/newmember", MemberRouter)

// Passport

const PassportConfig = require('./config/passport.js');
const pool = require('./db/pool.js');
passport.use(PassportConfig.Strategy)
app.use(session(
    {
        store: new pgSession({
            pool: pool,
            tableName: 'user_sessions',
            createTableIfMissing: true,
        }),
        secret: process.env.SECERT,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
    }
))

app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.member_id);
});


passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM member WHERE member_id = $1", [id]);
        const user = rows[0];
        
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Render Index page and Sign in page
app.get("/", (req, res, next) => {
    console.log(req.user)
    res.render("index", { user: req.user })
})

app.get("/sign-in", (req, res) => {
    res.render("member/sign-in")
})

app.post("/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    }))

app.listen(3000, () => {
    console.log("app is listening at port 3000")
})