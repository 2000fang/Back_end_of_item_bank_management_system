const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')

//获取题目列表处理函数
module.exports.getSubInfo = (req, res)=>{
    const sql = 'select * from subjects where course_name = ?'
    const subInfo = req.body

    db.query(sql, req.user.course_name ,(err, results)=>{
        if(err){
            res.cc('获取题目信息失败')
        } 
        res.send({
            "status": 0,
            "data": results,
        })
        
    } )
}

//添加题目处理函数
module.exports.addSubjects = (req, res)=>{

    const sql = 'insert into subjects (course_name, subject_type,subject_topic,subject_score,subject_answer,subject_optiona,subject_optionb,subject_optionc,subject_optiond,subject_chaper) values (?,?,?,?,?,?,?,?,?,?) '
    const subInfo = req.body

    db.query(sql, [req.user.course_name ,subInfo.subject_type,subInfo.subject_topic,subInfo.subject_score,subInfo.subject_answer,subInfo.subject_optiona,subInfo.subject_optionb,subInfo.subject_optionc,subInfo.subject_optiond,subInfo.subject_chaper],(err, results)=>{
        if(err){
            res.cc('添加题目信息失败')
        } 
        res.send({
            "status": 0,
            "message": "添加题目成功!",
        })
        
    } )
}   

//修改题目信息
module.exports.updSubject = (req, res)=>{
    const sql = 'update subjects set subject_type=?,subject_topic=?,subject_score=?,subject_answer=?,subject_optiona=?,subject_optionb=?,subject_optionc=?,subject_optiond=?,subject_chaper=? where subject_id =? '
    const subInfo = req.body

    db.query(sql, [subInfo.subject_type,subInfo.subject_topic,subInfo.subject_score,subInfo.subject_answer,subInfo.subject_optiona,subInfo.subject_optionb,subInfo.subject_optionc,subInfo.subject_optiond,subInfo.subject_chaper,subInfo.subject_id ],(err, results)=>{
        if(err){
            res.cc('更新题目信息失败')
        } 
        res.send({
            "status": 0,
            "message": "更新题目成功!",
        })
        
    } )
}

//删除题目信息
module.exports.deleSubject = (req, res)=>{
    const sql = 'delete from subjects where subject_id=? '
    db.query(sql, req.params.subject_id,(err, results)=>{
        if(err) return res.cc(err)
        else if(results.affectedRows!==1) res.cc('删除题目失败')
        else{
        res.send({
            status: 0,
            message: "删除题目成功",
        })
    }
    })
}