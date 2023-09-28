const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/store',async(req,res)=>{
    const username = req.session.user ? req.session.user.username : null;
    const user = req.session.user;
    res.render('store', { username });
})

module.exports = router;