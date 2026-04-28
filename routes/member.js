const express = require('express');
const pool = require("../db/pool.js");
const router = express();

router.get('/', (req, res) => {

})

router.get('/dashboard', async (req, res) => {
    const username = req.user.firstname + req.user.lastname
    const { rows } = await pool.query("SELECT * FROM massage_log WHERE author = ($1)", [username])
    res.render("member_only/member_main")
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

module.exports = router;