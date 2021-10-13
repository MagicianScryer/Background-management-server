// 导入joi
const joi = require('joi');

// 定义新增文章类别的api
const name = joi.string().required()
const alias = joi.string().alphanum().required()

exports.addcates = {
    body: {
        name,
        alias
    }
}

// 定义根据id删数据的api
const id = joi.number().integer().min(1).required();
exports.delete_cate_schema = {
    params: {
        id
    }
}

// 定义根据id更新数据的api
exports.update_cate_schema = {
    body: {
        id,
        name,
        alias,
    }
}