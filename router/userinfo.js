//导入express模块
const express = require('express')

//创建 express 的服务器实例
const router = express.Router()

//1.导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')

//2.导入需要验证的规则对象
const {add_user_schema} = require('../schema/user.js')


//导入路由处理函数模块
const routerHandler = require('../router_handler/userinfo_handler.js')

router.post('/add_user',expressJoi(add_user_schema),routerHandler.add_user)

module.exports = router