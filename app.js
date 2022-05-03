//导入express模块
const express = require('express')

//创建 express 的服务器实例
const app = express()
const joi = require('joi')

// //导入cors中间件
// const cors = require("cors")
// //将cors作为中间件
// app.use(cors())

app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin','http://localhost:3001'); //当允许携带cookies此处的白名单不能写’*’
    res.header('Access-Control-Allow-Headers','content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With'); //允许的请求头
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT'); //允许的请求方法
    res.header('Access-Control-Allow-Credentials',true);  //允许携带cookies
    next();
});


var bodyParser = require('body-parser')
//在路由里使用req.body即可接收到前端传过来的数据。

//解析表单数据的中间件，这个中间件只能解析这种数据
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json()) //app为express框架实例对象。


//定义res.cc中间件
app.use((req,res,next)=>{
    //默认status为1出现故障
    res.cc = (err,status = 1)=>{
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })

    }
    next()
})

// 导入配置文件 & 解析 token 的中间件 & 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
const config = require('./config')
const expressJWT = require('express-jwt')
app.use(expressJWT({ secret: config.jwtSecrectKey }).unless({ path: [/^\/api\//] }))

//导入路由模块
const loginRouter = require('./router/login')
app.use('/api',loginRouter)
const userinfoRouter = require('./router/userinfo')
app.use('/my',userinfoRouter)
const subjectRouter = require('./router/subject')
app.use('/my/subject',subjectRouter)
const paperRouter = require('./router/paper')
app.use('/api', paperRouter)


//错误组件
app.use((err,req,res,next)=>{
    if(err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')

    //未知错误  注意后端不能连续发两边res.send()
    res.cc(err)
})

//调用 app.listen 方法 ，指定端口号并启动web服务器
app.listen(80,()=>{
    console.log('sever is running at http://127.0.0.1')
})