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


router.post('/productback',uploadproductimg.single('productimg'),async(req,res)=>{
    const { productname, price, type, description  } = req.body;
    const productimgPath = req.file.filename;

    try {
        const [results, fields] = await connection.query('INSERT INTO products (product_name, price, type, description, image) VALUES (?, ?, ?, ?, ?)', [productname, price, type, description, productimgPath]);
        res.json({ success: true, message: '商品提交成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '服務器內部出現錯誤' });
    }
})

module.exports = router;