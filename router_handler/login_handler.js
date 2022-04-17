const db = require('../db/index')


module.exports. login= (req, res)=>{
    const userinfo = req.body
    //定义sql语句
    const sql = 'select * from users where user_name = ?'
    db.query(sql, userinfo.user_name,(err, results)=>{
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('登录失败')
        
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer '
        })
    
    })

    

}