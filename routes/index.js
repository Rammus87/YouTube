const express = require('express');
const router = express.Router();
const connection = require('../config/db');


router.get('/', async (req, res) => {
    const username = req.session.user ? req.session.user.username : null;
    const user = req.session.user;
    try {
        const [messages] = await connection.query('SELECT * FROM message');
        const [comments] = await connection.query('SELECT * FROM comment');
        res.render('index', { messages, comments, username, user });
    } catch (error) {
        console.error('數據庫查詢錯誤:', error);
        res.status(500).send('伺服器內部錯誤');
    }
});

module.exports = router;