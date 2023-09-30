const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/shoppingcart',async(req,res)=>{
    const username = req.session.user ? req.session.user.username : null;

    res.render('shoppingcart', {  username });
})

module.exports = router;