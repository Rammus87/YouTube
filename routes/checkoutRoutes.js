const express = require('express')
const router = express.Router();
const path = require('path');
const connection = require('../config/db');


router.get('/checkout',(req,res)=>{
    const username = req.session.user ? req.session.user.username : null;
    res.render('checkout',{ username })
})

module.exports = router;