//导入express模块
const express = require('express')

//创建 express 的服务器实例
const router = express.Router()


//导入路由处理函数模块
const routerHandler = require('../router_handler/paper_handler.js')

router.get('/paper/GeneratePaperById',routerHandler.GeneratePaperById)

module.exports = router