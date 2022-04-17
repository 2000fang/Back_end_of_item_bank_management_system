//导入mysql模块
const mysql = require("mysql")

//建立与mysql数据库的连接
const db = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'admin123',
    database : 'my_db_02'
})

module.exports = db