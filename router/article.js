const express = require('express');

// 实例化路由对象
const router = express.Router();

// 导入路由函数模块
const aritlehander = require('../router_handler/article');

// 导入并配置multer,导入path
const multer = require('multer');
const path = require('path');

// 创建multer实例,通过实例来解析表单
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
const uploads = multer({ dest: path.join(__dirname, '../uplodes') });

// 挂载发表文章路由
// 导入验证规则和验证模块
const schema = require('../schema/article');
const expressJoi = require('@escook/express-joi');

router.post('/add', uploads.single('cover_img'), expressJoi(schema.schema_article_add), aritlehander.addArticle);

// 向外提供路由对象
module.exports = router;