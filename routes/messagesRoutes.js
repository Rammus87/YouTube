//首頁路由
const express = require('express');
const router = express.Router();
const multer = require('multer');
const connection = require('../config/db');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // 上傳存這邊
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, 'avatar-' + Date.now() + '.' + ext); //文件名時間
    }
});

const upload = multer({ storage: storage });

// 首頁留言和評論
router.post('/postMessage',upload.single('avatar'), async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).send('用户未登录');
    }

    const { title, message, username } = req.body; // 請求的內容
    const avatar = user.avatar || null;
    try {
        if (title && message) {
            // 如果存在 title 和 message，则插入留言
            await connection.query('INSERT INTO message (username, title, message, avatar) VALUES (?, ?, ?, ?)', [user.username, title, message, avatar]);
        } else if (username && message) {
            // 如果存在 username 和 message，則插入評論
            await connection.query('INSERT INTO comment (message_id, username, comment, avatar) VALUES (?, ?, ?, ?)', [user.id, username, message, avatar]);
        } else {
            return res.status(400).send('請求不正確');
        }
        res.redirect('/');
    } catch (error) {
        console.error('插入留言失敗:', error);
        res.status(500).send('服務器發生錯誤');
    }
});

module.exports = router;
