const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')

//获取题目列表处理函数
module.exports.getSubInfo = (req, res)=>{
    const sql = 'select * from subjects where course_id = ?'
    const subInfo = req.body

    db.query(sql, req.user.course_id ,(err, results)=>{
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

    const sql = 'insert into subjects (course_id, subject_type,subject_topic,subject_score,subject_answer,subject_optiona,subject_optionb,subject_optionc,subject_optiond) values (?,?,?,?,?,?,?,?,?) '
    const subInfo = req.body

    db.query(sql, [req.user.course_id ,subInfo.subject_type,subInfo.subject_topic,subInfo.subject_score,subInfo.subject_answer,subInfo.subject_optiona,subInfo.subject_optionb,subInfo.subject_optionc,subInfo.subject_optiond],(err, results)=>{
        if(err){
            res.cc('添加题目信息失败')
        } 
        res.send({
            "status": 0,
            "message": "添加题目成功!",
        })
        
    } )
}   