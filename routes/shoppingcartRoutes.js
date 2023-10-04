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

//更新購物車數量
router.post('/updateQuantity', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = req.session.user;

        if (!user) {
            return res.status(403).json({ message: '用户未登录' });
        }

        // 更新數量
        const result = await connection.query(
            'UPDATE shoppingcart SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [quantity, user.id, productId]
        );

        if (result.affectedRows === 1) {
            res.json({ message: '數量已更新' });
        } else {
            res.status(404).json({ message: '找不到購物車商品' });
        }
    } catch (error) {
        console.error('更新失敗:', error);
        res.status(500).json({ message: '服務器' });
    }
});


module.exports = router;