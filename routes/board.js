const express = require('express');
const pool = require("../db/pool.js");
const router = express();

router.get("/", async (req, res) => {
    const Member = await pool.query("SELECT * FROM member WHERE firstname = ($1) AND lastname = ($2) ", [req.user.firstname, req.user.lastname])
    const { rows } = await pool.query("SELECT * FROM massage_log WHERE membership = ($1)", [Member.rows[0].membership_status])
    const Allpost = await pool.query("SELECT * FROM massage_log")

    
    res.render("Board/Board", { posts: rows, user: req.user, allpost: Allpost, admin_status: req.user.membership_status })
})

router.post('/deletepost', async (req, res) => {
    try {
        await pool.query("DELETE FROM massage_log WHERE id = ($1)", [req.body.postid])
        res.redirect("/member/dashboard")
    } catch (error) {
        res.redirect("/dashboard")
    }
})



module.exports = router