const db = require('./index')
let id

//根据course_name查询course_id如果表中不存在则兴建一个在返回id
/*
module.exports.findCourseId = (course_name)=>{
    const sql = 'select * from courses where course_name = ?'
    
    db.query(sql,course_name,(err,results)=>{
        if(results.length === 1) {
            console.log('results[0].course_id: '+results[0].course_id)
            id = results[0].course_id
            
        }
        else{
        const sqlstr = 'insert into courses (course_id,course_name) values(?,?)'

        db.query(sqlstr,[,course_name], (err,data)=>{
            //console.log('sdfdsfds')
            id = data[0].course_id
        })
        }
        
    })
    console.log(id)
    return id
}
*/