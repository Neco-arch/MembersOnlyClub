const express = require("express");
const pool = require("../db/pool.js");
const router = express();

router.get("/sign-up", (req, res, next) => {
    res.render("member/sign-up");
});

router.post("/sign-up", async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await pool.query("INSERT INTO users (username, password) VALUES ($1, $2 , $3 , $4 )", [
            req.body.username,
            hashedPassword,
            req.body.email,
            req.body.password,
        ]);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        next(error);
    }
    res.redirect("/");
});

module.exports = router;
