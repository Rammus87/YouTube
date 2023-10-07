//儲存用戶相關路由
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const connection = require('../config/db');

//上傳大頭貼配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); //上傳的照片存在這
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, 'avatar-' + Date.now() + '.' + ext); // 文件時間
    }
});

const upload = multer({ storage: storage });


router.get('/login',(req,res)=>{
    const username = req.session.user ? req.session.user.username : null;
    res.render('login',{ username });
})

router.get('/register',(req,res)=>{
    const username = req.session.user ? req.session.user.username : null;
    res.render('createuser',{ username });
})

router.get('/user/profile', (req, res) => {
    const user = req.session.user; 
    const username = req.session.user ? req.session.user.username : null;
    res.render('backend', { user , username });
});

//獲取大頭貼
router.get('/user/avatar', (req, res) => {
    const user = req.session.user;
    if (!user || !user.avatar) {
        console.log('未有大頭貼')
        return res.sendFile(path.join(__dirname, '../public','img','DSC00084.JPG'));
    }
    const avatarPath = path.join(__dirname, '../public', 'uploads', user.avatar);
    res.sendFile(avatarPath);
});

router.get('/user/avatar/:username', (req, res) => {
    const { username } = req.params;
    const avatarPath = path.join(__dirname, '../public', 'uploads', `${username}.jpg`); 
    res.sendFile(avatarPath);
});


//登入頁面
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('接收到登入請求:', username, password);

    try {
        const [results, fields] = await connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (results.length > 0) {
            req.session.user = results[0];
            console.log('用户已登入:', username);
            res.json({ success: true, message: '登入成功' });
        } else {
            console.log('帳號或密碼錯誤');
            res.status(401).json({ success: false, message: '帳號或密碼錯誤' });
        }
    } catch (error) {
        console.error('查詢時出現錯誤：' + error);
        res.status(500).json({ success: false, message: '服務器錯誤' });
    }
});


//註冊頁面
router.post('/register', async (req, res) => {
    const { username, password, email, sex, usertype, creationtype } = req.body;

    // 测试
    console.log('JSON 數據:', req.body);

    try {
        const [results, fields] = await connection.query('INSERT INTO users (username, password, email, sex, usertype, creationtype) VALUES (?, ?, ?, ?, ?, ?)', [username, password, email, sex, usertype, creationtype]);
        res.json({ success: true, message: '註冊成功' });
    } catch (error) {
        console.error( error);
        res.status(500).json({ success: false, message: '服務器內部出現錯誤' });
    }
});


//後台
router.post('/updateProfile', upload.single('avatar'), async (req, res) => {
    const user = req.session.user;
    const { nickname, sex, usertype } = req.body;
    const avatar = req.file ? req.file.filename : user.avatar; // 上传头像

    try {
        const [results, fields] = await connection.query(
            'UPDATE users SET nickname = ?, sex = ?, usertype = ?, avatar = ? WHERE id = ?',
            [nickname, sex, usertype, avatar, user.id]
        );

        console.log('個人資料已更新');
        user.avatar = avatar; 
        res.json({ success: true, message: '個人資料已更新' });
    } catch (error) {
        console.error('更新用戶資料出現錯誤：' + error);
        res.status(500).json({ success: false, message: '服务器内部出现错误' });
    }
});


module.exports = router;