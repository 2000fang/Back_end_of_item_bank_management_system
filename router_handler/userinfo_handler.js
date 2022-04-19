const db = require('../db/index')
const bcrypt = require('bcryptjs')
const db_handle = require('../db/db.js')
//添加用户
module.exports.add_user = (req, res)=>{
    const userinfo = req.body
    const sqlStr = "select * from courses where course_name = ?"
    req.body.course_id = '1'
    
    //查询course_name对应的course_id
    db.query(sqlStr, userinfo.course_name, (err, results)=>{
        if(err){
            return res.cc(err)
        }
    
        if(results.length > 0){
            req.body.course_id = results[0].course_id
           
        }
        else{
            //不存在course_name,则插入一个course——name并获得id
            const insertsql = 'insert into courses (course_name) values(?)'
            db.query(insertsql, userinfo.course_name, (err, results)=>{
                if(err) res.cc(err)
                if(results.affectedRows !== 1){
                    return res.cc('插入课程表失败')
                }
                
            })
            db.query(sqlStr, userinfo.course_name, (err, results)=>{
                req.body.course_id = results[0].course_id
                 
            })
        }
    
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

//获取用户信息
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

//更新密码
module.exports.updatepwd = (req, res)=>{
  // 根据 id 查询用户的信息
  const sql = `select * from users where user_id=?`
  // 执行根据 id 查询用户的信息的 SQL 语句
  db.query(sql, req.user.user_id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 判断结果是否存在
    if (results.length !== 1) return res.cc('用户不存在！')

    // 判断密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].user_password)
    if (!compareResult) return res.cc('旧密码错误！')

    // 定义更新密码的 SQL 语句
    const sql = `update users set user_password=? where user_id=?`
    // 对新密码进行加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, [newPwd, req.user.user_id], (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err)
      // 判断影响的行数
      if (results.affectedRows !== 1) return res.cc('更新密码失败！')
      // 成功
      res.cc('更新密码成功', 0)
    })
  })
}
