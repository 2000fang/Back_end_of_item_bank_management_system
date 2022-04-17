const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports. login= (req, res)=>{
    const userinfo = req.body
    //定义sql语句
    const sql = 'select * from users where user_name = ?'
    db.query(sql, userinfo.user_name,(err, results)=>{
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('登录失败')
        
        //判断密码是否正确

        //管理员用户，密码未加密
        if(results[0].is_super_admin === 1){
            if(results[0].user_password === userinfo.user_password){
                //在服务端生成TOKEN字段
                const user = {...results[0], password:'', user_pic:''}
                const tokenStr = jwt.sign(user, config.jwtSecrectKey, { expiresIn: config.expiresIn })
                return res.send({
                    status: 0,
                    message: '登录成功',
                    token: 'Bearer '+ tokenStr,
                })
        
            }
            return res.cc('密码错误，登陆失败')    
        }
        //普通用户，密码加密
   
        const compareResult = bcrypt.compareSync(userinfo.user_password, results[0].user_password)
        if(!compareResult) return res.cc('密码错误')

        //在服务端生成TOKEN字段
        const user = {...results[0], user_password:''}

        const tokenStr = jwt.sign(user, config.jwtSecrectKey, { expiresIn: config.expiresIn })

        res.send({
            status: 0,
            message: '登陆成功！',
            token: 'Bearer '+ tokenStr,
        })
    })
}