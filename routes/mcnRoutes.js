const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/mcn',async(req,res)=>{
    const username = req.session.user ? req.session.user.username : null;
    const user = req.session.user;
    try {
        const [results, fields] = await connection.query('SELECT title, username, location, content, avatar, created_at FROM mcn');
        const projects = results;
        res.render('mcn', { projects, username });
    } catch (error) {
        console.error('數據庫撈資料時發生錯誤：' + error);
        res.status(500).json({ success: false, message: '數據庫撈資料時發生錯誤：' });
    }
})

router.post('/mcnpost',async(req,res)=>{
    const user = req.session.user;
    if (!user) {
        return res.status(401).send('用户未登入');
    }
    const { title,location,content, username } = req.body;
    const avatar = user.avatar || null;

    if (!title || !location || !content) {
        return res.status(400).send('請填寫完整');
    }
    try {
        const [results, fields] = await connection.query('INSERT INTO mcn (title, location, content, username, avatar) VALUES (?, ?, ?, ?, ?)', [title, location, content, user.username, avatar]);
        res.json({ success: true, message: '發案消息發送成功' });
    } catch (error) {
        console.error('存入數據庫發生錯誤：' + error);
        res.status(500).json({ success: false, message: '存入數據庫發生錯誤' });
    }
})

module.exports = router;