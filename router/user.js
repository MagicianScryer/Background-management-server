// 导入express
const express = require('express');

// 导入信息验证模块
const schema = require('../schema/user');
// 导入express信息验证中间件
const expressjoi = require('@escook/express-joi');

// 实例路由对象
const router = express.Router();
// 导入处理函数
const userhandler = require('../router_handler/user');

// 注册新用户
// 3. 在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 3.1 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 3.2 数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
router.post('/reguser', expressjoi(schema.reg_login_schema), userhandler.reguser);

// 登录路由
router.post('/login', expressjoi(schema.reg_login_schema), userhandler.login);

module.exports = router;