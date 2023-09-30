const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/store',async(req,res)=>{
    const username = req.session.user ? req.session.user.username : null;
    try {
        const [results, fields] = await connection.query('SELECT product_name, price, type, description, image FROM products');
        const products = results;
        res.render('store', { products, username });
    } catch (error) {
        console.error('數據庫撈資料時發生錯誤：' + error);
        res.status(500).json({ success: false, message: '數據庫撈資料時發生錯誤：' });
    }
})

router.post('/addToCart', async (req, res) => {
    const { productid, quantity } = req.body;
    const userid = req.session.user.id; 
    try {
        // 檢查購物車中是否已存在相同商品
        const [existingCartItem] = await connection.query(
            'SELECT * FROM shoppingcart WHERE user_id = ? AND product_id = ?',
            [userid, productid]
        );

        if (existingCartItem.length > 0) {
            // 如果商品已經存在於購物車中，則更新數量
            const updatedQuantity = existingCartItem[0].quantity + quantity;
            await connection.query(
                'UPDATE shoppingcart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [updatedQuantity, userIi, productid]
            );
        } else {
            // 如果商品不存在於購物車中，則插入新的資料
            await connection.query(
                'INSERT INTO shoppingcart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userid, productid, quantity]
            );
        }
        res.json({ success: true, message: '已加入購物車' });
    } catch (error) {
        console.error('加入購物車時發生錯誤：' + error);
        res.status(500).json({ success: false, message: '加入購物車時發生錯誤：' });
    }
});

module.exports = router;