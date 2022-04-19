const db = require('../db/index')
const bcrypt = require('bcryptjs')
const db_handle = require('../db/db.js')

module.exports.add_user = (req, res)=>{
    res.send('OK')       
}

module.exports.getUserInfo = (req, res)=>{
    //定义sql语句
    const sql = 'select user_id,user_name,course_id,is_super_admin from users where user_id = ?'
    //执行sql语句
    db.query(sql, req.user.user_id,(err, results)=>{
        if(err) return res.cc(err)

        if(results.length !== 1) return res.cc('获取用户信息失败')

        //将用户信息返回给客户端
        res.send({
            status: 0,
            message: '查询成功',
            data: results[0],
        })

    })
}

module.exports.updatepwd = (req, res)=>{
    res.send('ok')
}
