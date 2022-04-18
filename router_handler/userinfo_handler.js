const db = require('../db/index')
const bcrypt = require('bcryptjs')
const db_handle = require('../db/db.js')

module.exports.add_user = (req, res)=>{
    let course_id = db_handle.findCourseId(req.body.course_name)
    console.log(course_id)
    res.send(course_id)       
}
  
