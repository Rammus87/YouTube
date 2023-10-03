const express = require('express')
const router = express.Router();
const path = require('path');
const connection = require('../config/db');


router.get('/checkout',async(req,res)=>{
    const username = req.session.user ? req.session.user.username : null;
    try {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/store'); 
        }
        const [checkoutItems] = await connection.query(
            `SELECT shoppingcart.quantity, products.product_name, products.price, products.image FROM shoppingcart JOIN products ON shoppingcart.product_id = products.product_id WHERE shoppingcart.user_id = ?`, [user.id]);
            res.render('checkout', { username: req.session.user.username, checkoutItems });
    } catch (error) {
        console.error('結帳資料錯誤:', error);
        res.status(500).send('服務器錯誤');
    }
})

module.exports = router;