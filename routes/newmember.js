const express = require("express");
const pool = require("../db/pool.js");
const router = express();
const bcrypt = require('bcrypt')
const { body } = require('express-validator')

router.get("/sign-up", (req, res, next) => {
    res.render("member/sign-up");
});

router.post("/sign-up", [
    body('password').custom((value, { req }) => {
        return value === req.body.password
    }),
    body('email').custom(async (value) => {
        const { rows } = await pool.query("SELECT email FROM member WHERE email = ($1)", [value])

        if (rows.length > 0) {
            throw new Error("E-mail in use")
        }
    }),

], async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await pool.query("INSERT INTO member (firstname, lastname , email , password , membership_status ) VALUES ($1, $2 , $3 , $4 , $5)", [
            req.body.Firstname,
            req.body.Lastname,
            req.body.email,
            hashedPassword,
            "none"
        ]);
    } catch (error) {
        console.error(error);
        next(error);
    }
    res.redirect("/");
});

module.exports = router;
