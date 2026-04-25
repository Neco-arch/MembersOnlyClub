const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../db/pool.js')
const bcrypt = require('bcrypt');

const Strategy = new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
        try {
            const { rows } = await pool.query("SELECT * FROM email WHERE email = $1", [username]);
            const user = rows[0];

            const match = await bcrypt.compare(password, user.password);

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })

module.exports = {
    Strategy,

}