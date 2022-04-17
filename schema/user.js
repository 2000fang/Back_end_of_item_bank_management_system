const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

//用户名的验证规则
const user_name = joi.string().alphanum().min(3).max(30).required()
//密码的验证
const user_password = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
//课程名称验证
const course_name = joi.string().required()
exports.login_schema = {
    body:{
        user_name,
        user_password,
    },
}

exports.add_user_schema = {
    body:{
        user_name,
        user_password,
        course_name,
    },
}
