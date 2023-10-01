const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/shoppingcart',async(req,res)=>{
    try {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/store'); 
        }
        const [cartItems] = await connection.query(
            `SELECT shoppingcart.quantity, products.product_name, products.price, products.image FROM shoppingcart JOIN products ON shoppingcart.product_id = products.product_id WHERE shoppingcart.user_id = ?`, [user.id]);
        res.render('shoppingcart', { username: req.session.user.username, cartItems });
    } catch (error) {
        console.error('購物車資料庫錯誤:', error);
        res.status(500).send('服務器錯誤');
    }
})

module.exports = router;