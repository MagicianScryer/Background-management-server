// 导入express模块
const express = require('express');

// 实例路由对象
const router = express.Router();

// 挂载获取文章分类的列表数据路由
// 导入路由函数
const userhandler = require('../router_handler/artcate');
router.get('/cates', userhandler.getArticleCates);

// 挂载新增文章分类的路由
// 导入路由函数

// 导入验证规则,和验证模块
const schema = require('../schema/artcat');
const express_joi = require('@escook/express-joi');

router.post('/addcates', express_joi(schema.addcates), userhandler.addArticleCates);

// 挂载根据id删除文章分类的路由
router.get('/deletecate/:id', express_joi(schema.delete_cate_schema), userhandler.deleteCateById);

// 挂载根据id查询文章分类的路由
router.get('/cates/:id', express_joi(schema.delete_cate_schema), userhandler.getArticleById);

// 挂载根据id更新文章分类的路由
router.post('/updatecate', express_joi(schema.update_cate_schema), userhandler.updateCateById);

module.exports = router;