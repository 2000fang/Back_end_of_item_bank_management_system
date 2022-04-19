const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { UTF8MB4_CROATIAN_MYSQL561_CI } = require('mysql/lib/protocol/constants/charsets')
const { use } = require('../router/login')
//登录处理函数
module.exports.login= (req, res)=>{
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

//注册处理函数
module.exports.reguser = (req, res)=>{
const userinfo = req.body
const sqlStr = "select * from courses where course_name = ?"
req.body.course_id = '1'

db.query(sqlStr, userinfo.course_name, (err, results)=>{
    if(err){
        return res.cc(err)
    }

    if(results.length > 0){
        req.body.course_id = results[0].course_id
       
        console.log('第一遍插入'+req.body.course_id)
    }
    else{
        const insertsql = 'insert into courses (course_name) values(?)'
        db.query(insertsql, userinfo.course_name, (err, results)=>{
            if(err) res.cc(err)
            if(results.affectedRows !== 1){
                return res.cc('插入课程表失败')
            }
            
        })
        db.query(sqlStr, userinfo.course_name, (err, results)=>{
            req.body.course_id = results[0].course_id
           
            console.log('第二遍插入'+req.body.course_id)      
        })
    }
    //res.send('最终'+req.body.course_id)

    //向users表中插入数据
    //首先查询users表中是否已存在x
    const sql = 'select * from users where user_name =?'
    db.query(sql, userinfo.user_name,(err, results)=>{
        if(err) return res.cc('失败')
        if(results.length === 1) return res.cc('用户已存在，注册失败')
        else{
            const sql1 = 'insert into users (user_name,user_password,course_id) values(?,?,?)'
            //加密密码
            userinfo.user_password = bcrypt.hashSync(userinfo.user_password,10)
            db.query(sql1, [userinfo.user_name,userinfo.user_password,req.body.course_id],(err,results)=>{
                if(err) return res.cc('插入用户失败')
                if(results.affectedRows !== 1) return res.cc('插入用户失败,稍后再试')
                res.cc('插入用户成功',0)
            })
        }
    })

})

}