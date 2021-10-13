// 导入express
const express = require('express');

// 导入路由处理函数
const uIHanders = require('../router_handler/userinfo');

// 实例路由对象
const router = express.Router();

// 导入验证规则
const schema = require('../schema/user');
// 导入表单验证模块中间件
const expressjoi = require('@escook/express-joi');

// 获取用户的基本信息路由
router.get('/userinfo', uIHanders.userinfo);
// 更新用户基本信息
router.post('/userinfo', expressjoi(schema.update_userinfo_schema), uIHanders.updata);
// 重置密码路由
router.post('/updatepwd', expressjoi(schema.update_password_schema), uIHanders.resetpwd);
// 更新头像路由
router.post('/update/avatar', expressjoi(schema.updata_avater), uIHanders.avater);

// 向外提供路由对象
module.exports = router;