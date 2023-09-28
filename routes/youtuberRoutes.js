const express = require('express');
const router = express.Router();
const connection = require('../config/db');

//存入內容的數組
router.get('/youtuber',async (req, res) => {
    const username = req.session.user ? req.session.user.username : null;
    const user = req.session.user;
    try {
        const [results, fields] = await connection.query('SELECT title, username, creationtype, fanscount, location, content, avatar, created_at FROM youtuberposts');
        const projects = results;
        res.render('youtuber', { projects, username });
    } catch (error) {
        console.error('數據庫撈資料時發生錯誤：' + error);
        res.status(500).json({ success: false, message: '數據庫撈資料時發生錯誤：' });
    }
});


router.post('/youtuberpost',async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).send('用户未登入');
    }
    const { title, fanscount, location, content, username, creationtype } = req.body;
    const avatar = user.avatar || null;

    if (!title || !fanscount || !location || !content) {
        return res.status(400).send('請填寫完整');
    }
    try {
        const [results, fields] = await connection.query('INSERT INTO youtuberposts (title, fanscount, location, content, username, avatar, creationtype) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, fanscount, location, content, user.username, avatar, user.creationtype]);
        res.json({ success: true, message: '接案消息發送成功' });
    } catch (error) {
        console.error('存入數據庫發生錯誤：' + error);
        res.status(500).json({ success: false, message: '存入數據庫發生錯誤' });
    }
});

module.exports = router;