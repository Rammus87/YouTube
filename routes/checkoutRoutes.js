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

router.post('/orders', async (req, res) => {
    const { name, address, payment } = req.body;
    let totalAmount = 0;
  
    try {
      const user = req.session.user;
  
      if (!user) {
        return res.redirect('/store');
      }
  
      const [checkoutItems] = await connection.query(
        `SELECT shoppingcart.quantity, products.product_name, products.price FROM shoppingcart JOIN products ON shoppingcart.product_id = products.product_id WHERE shoppingcart.user_id = ?`,
        [user.id]
      );
  
      // 計算總金額
      checkoutItems.forEach((checkout) => {
        totalAmount += checkout.quantity * checkout.price;
      });
      
      const orderName = checkoutItems.map((item) => item.product_name).join(', ');
      const orderQuantity = checkoutItems.map((item) => item.quantity).reduce((a, b) => a + b, 0);
      const orderPrice = totalAmount;

      await connection.query(
        `INSERT INTO orders (user_id, total_amount, shippingaddress, paymentmethod, order_name, quantity, order_price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user.id, totalAmount, address, payment, orderName, orderQuantity, orderPrice]
      );
  
      // 清除購物車
      await connection.query(`DELETE FROM shoppingcart WHERE user_id = ?`, [user.id]);
  
      console.log('訂單成功插入數據庫');
      console.log('購物車數據已清除');
      res.redirect('/shoppingcart');
    } catch (error) {
      console.error('處理訂單出錯:', error);
      res.status(500).send('錯誤');
    }
});
  

module.exports = router;