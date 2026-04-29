const express = require('express');
const pool = require("../db/pool.js");
const router = express();

router.get("/", async (req, res) => {
    const Member = await pool.query("SELECT * FROM member WHERE firstname = ($1) AND lastname = ($2) ", [req.user.firstname, req.user.lastname])
    console.log(Member.rows)
    const { rows } = await pool.query("SELECT * FROM massage_log WHERE membership = ($1)", [Member.rows[0].membership_status])
    res.render("Board/Board", {posts : rows} )
})



module.exports = router