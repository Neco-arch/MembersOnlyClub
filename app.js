require('dotenv').config()
const express = require("express")
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const NewMemberRouter = require('./routes/newmember')
const MemberRouter = require('./routes/member')
const BoardRouter = require('./routes/board')
const pgSession = require('connect-pg-simple')(session);
const path = require('node:path')

const app = express()

// Default Config
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const pool = require('./db/pool.js');
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'user_sessions',
        createTableIfMissing: true,
    }),
    secret: process.env.SECERT,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}))

app.use(passport.session());

const PassportConfig = require('./config/passport.js');
passport.use(PassportConfig.Strategy)

passport.serializeUser((user, done) => {
    done(null, user.member_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM member WHERE member_id = $1", [id]);
        done(null, rows[0]);
    } catch (err) {
        done(err);
    }
});


app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});


app.use("/newmember", NewMemberRouter);
app.use("/member", MemberRouter);
app.use("/board", BoardRouter)

app.get("/", (req, res) => {
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