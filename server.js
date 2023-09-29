const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const port = 3000;

//中間項
app.use(express.urlencoded({ extended: true })); //獲取post數據
app.use(express.json())//獲取json格式的post數據
app.use(express.static(path.join(__dirname, 'public'))); //靜態資料夾
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(session({
    secret: 'logined',
    resave: false,
    saveUninitialized: true,
  })); //登入狀態

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views')); //配置ejs

//導入路由
const usersRoutes = require('./routes/usersRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const indexRouter = require('./routes/index');
const youtuberRoutes = require('./routes/youtuberRoutes');
const mcnRoutes = require('./routes/mcnRoutes');
const storeRoutes = require('./routes/storeRoutes')
const productbackRoutes = require('./routes/productbackRoutes')

//使用路由
app.use('/', indexRouter);
app.use('/', usersRoutes);
app.use('/', messagesRoutes); 
app.use('/', youtuberRoutes);
app.use('/', mcnRoutes);
app.use('/', storeRoutes);
app.use('/', productbackRoutes);

app.use((err, req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Request Path:', req.path);
    console.error('發生錯誤:', err);
    res.status(500).send('服务器内部错误');
});

app.listen(port , ()=>{
    console.log('伺服器成功連接至' + port + ' port')
})
