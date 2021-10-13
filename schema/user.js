// 该模块提供验证规则
const joi = require('joi');
//  * string() 值必须是字符串
//  * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
//  * min(length) 最小长度
//  * max(length) 最大长度
//  * required() 值是必填项，不能为 undefined
//  * pattern(正则表达式) 值必须符合正则表达式的规则
const password = joi.string().pattern(/^[\S]{6,15}$/).required();
exports.reg_login_schema = {
    body: {
        username: joi.string().alphanum().min(1).max(10).required(),
        password: password
    }
}

exports.update_userinfo_schema = {
    body: {
        id: joi.number().integer().min(1).required(),
        nickname: joi.string().required(),
        email: joi.string().email().required(),
    }
}

// 验证密码数据
exports.update_password_schema = {
    body: {
        // 使用 password 这个规则，验证 req.body.oldPwd 的值
        oldPwd: password,
        // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
        // 解读：
        // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
        // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
        // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    },
}

// 验证更新头像的数据
const avatar = joi.string().dataUri().required()
exports.updata_avater = {
    body: {
        avatar
    }
}