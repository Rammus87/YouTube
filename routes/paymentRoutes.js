const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const { render } = require('ejs');

router.get('/payment',async(req,res)=>{
    try{
        const user = req.session.user;
        if (!user) {
            return res.redirect('/store'); 
        }
        const [ordersItem] = await connection.query('SELECT order_name, order_price, status, order_date FROM orders WHERE user_id = ?',[user.id]);
        console.log(user)
        res.render('payment',{username: req.session.user.username, ordersItem});
    } catch (error) {
        console.error('購物車資料庫錯誤:', error);
        res.status(500).send('服務器錯誤');
    }
    
})

module.exports = router;