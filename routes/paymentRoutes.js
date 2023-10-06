const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const { render } = require('ejs');

router.get('/payment',async(req,res)=>{
    try{
        const user = req.session.user;
        const [ordersItem] = await connection.query('SELECT order_name, order_price, status, order_date FROM orders');
        console.log(ordersItem)
        res.render('payment',{user , ordersItem});
    } catch (error) {
        console.error('購物車資料庫錯誤:', error);
        res.status(500).send('服務器錯誤');
    }
    
})

module.exports = router;