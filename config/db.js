const mysql = require('mysql2'); //引入資料庫

//數據庫連接
const pool = mysql.createPool({
    host:'localhost',
    port:'8889',
    user:'root',
    password:'root',
    database:'message_board',
})

const connection = pool.promise();

connection.query('SELECT 1').then(([rows,fields]) => {
    console.log("資料庫連接成功");
})
.catch((error)=>{
    console.error('資料庫連接失敗:' + error)
})

module.exports = connection;