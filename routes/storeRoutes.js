const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/store',async(req,res)=>{
    const username = req.session.user ? req.session.user.username : null;
    const user = req.session.user;
    try {
        const [results, fields] = await connection.query('SELECT product_name, price, type, description, image FROM products');
        const products = results;
        res.render('store', { products, username });
    } catch (error) {
        console.error('數據庫撈資料時發生錯誤：' + error);
        res.status(500).json({ success: false, message: '數據庫撈資料時發生錯誤：' });
    }
})

module.exports = router;