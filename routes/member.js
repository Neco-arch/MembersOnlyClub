const express = require('express');
const pool = require("../db/pool.js");
const router = express();

router.get('/', (req, res) => {

})

router.get('/dashboard', async (req, res) => {
    const username = req.user.firstname + req.user.lastname
    const { rows } = await pool.query("SELECT * FROM massage_log WHERE author = ($1)", [username])
    res.render("member_only/member_main", { user: req.user, post: rows })
})

router.post('/deletepost', async (req, res) => {
    try {
        await pool.query("DELETE FROM massage_log WHERE id = ($1)", [req.body.postid])
        res.redirect("/member/dashboard")
    } catch (error) {
        res.redirect("/dashboard")
    }
})

router.post('/joinsecertclub', async (req, res) => {
    const code = req.body.party_code;
    const { rows } = await pool.query("SELECT * FROM clubs WHERE code = ($1)", [code])

    if (rows.length === 1) {
        const clubname = rows[0].clubname
        await pool.query("INSERT INTO member(membership_status) VALUES(($1))", [clubname])
        res.redirect("/member/dashboard")
    } else {

    }

})

router.post('/SendMassage', async (req, res) => {
    const MassageDate = new Date().toLocaleString()
    const querymassage = 'INSERT INTO massage_log(author , text , time) VALUES ($1 , $2 , $3)'
    try {
        await pool.query(querymassage, [req.user.firstname + req.user.lastname, req.body.massage, MassageDate])
        res.redirect("/member/dashboard")
    } catch (error) {
        console.log(error)
    }
})

router.post('/joinsecertclub', async (req, res) => {

})
module.exports = router;