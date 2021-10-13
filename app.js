const express = require('express');

const app = express();
// 导入并注册cors中间件
const cors = require('cors');
app.use(cors());
// 配置解析表单的中间件 只能解析x-www-form-urlencoded格式
app.use(express.urlencoded({ extended: false }));

// 在res上挂载错误返回信息
// 其他的中间件必须写在它的下面才能使用
app.use((req, res, next) => {
    // 状态默认为1
    // err等与err对象或者字符串
    res.cc = (err, status = 1) => {
        res.send({
            status: status,
            message: err instanceof Error ? err.message : err
        });
    }
    next();
});

// 导入密钥
const { jwtsecretkey } = require('./config');
// 导入配置解析token的中间件
const expressJWT = require('express-jwt');
app.use(expressJWT({ secret: jwtsecretkey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }));

// 导入joi模块
const joi = require('joi');

// 托管文章图片中间件
app.use('/uploads', express.static('./uplodes'));


// 导入注册登入路由中间件
const userrouter = require('./router/user');
app.use('/api', userrouter);

// 导入注册 个人中心userinfo路由
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter);

// 导入文章类别管理路由模块
const catesRouter = require('./router/artcate');
app.use('/my/article', catesRouter);

// 导入文章管理的路由模块


const addArticle = require('./router/article');
app.use('/my/article', addArticle);

// 封装错误级别的中间件

app.use((err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err.message);

    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！');
    // 未知错误
    return res.cc(err)
});

app.listen(3007, () => {
    console.log('express runing at http://127.0.0.1:3007');
});