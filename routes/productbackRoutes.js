const express = require('express');
const router = express.Router();
const path = require('path'); //商品照片路徑
const multer = require('multer'); //上傳用配置
const connection = require('../config/db');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/products'); //上傳的照片存在這
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, 'product-' + Date.now() + '.' + ext); // 取名和文件時間
    }
});

const uploadproductimg = multer({ storage: storage });

router.get('/productback', (req,res)=>{
    res.render('createproduct')
})

router.post('/postcreateproduct',uploadproductimg.single('productimg'),async(req,res)=>{
    const { productname, price, type, description  } = req.body;
    const productimgPath = req.file.filename;

    const sql = 'INSERT INTO products (product_name, price, type, description, image) VALUES (?, ?, ?, ?, ?)';
    const values = [productname, price, type, description, productimgPath];
    try {
        await new Promise((resolve, reject) => {
            connection.query(sql, values, (err, results) => {
                if (err) {
                    console.error(err); 
                    return res.status(500).send('發生錯誤，無法新增商品');
                } else {
                    resolve(results);
                }
            });
        });
        res.redirect('/productback'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('發生錯誤，無法新增商品');
    }
})

module.exports = router;