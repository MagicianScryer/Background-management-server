// 定义路由处理函数

// 导入数据库
const db = require('../db/index');

// 导入加密的模块
const bcrypt = require('bcryptjs');

// 导入jwt包
const jwt = require('jsonwebtoken');
// 导入密钥
const { jwtsecretkey } = require('../config');

// 1 定义注册路由处理函数
//  注册函数
exports.reguser = (req, res) => {
    // 判断数据是否为空
    let userinfo = req.body;
    if (!userinfo.username && !userinfo.password) {
        return res.cc('用户名或密码不能为空');
    }

    // 检测用户名是否被占用
    let sqlStr = 'select * from ev_users where username= ?';
    db.query(sqlStr, [userinfo.username], (err, result) => {
        if (err) return res.cc(err)
        if (result.length > 0) {
            return res.cc('用户名被占用,请更换其他用户名');
        };

        userinfo.password = bcrypt.hashSync(userinfo.password, 10);

        // 插入新的用户
        let insertSQL = 'insert into ev_users set ?'
        db.query(insertSQL, { username: userinfo.username, password: userinfo.password }, (err, result) => {
            if (err) return res.cc(err);

            return res.cc('注册成功', 0);
        });
    });
};

// 登入函数
exports.login = (req, res) => {
    // 接受表单数据
    const userinfo = req.body;

    // 查询数据库内是否有这个数据
    let sqlSelect = 'select * from ev_users where username = ?';
    db.query(sqlSelect, userinfo.username, (err, result) => {
        if (err) return res.cc(err);

        // 判断是否有这个值
        if (result.length !== 1) return res.cc("您输入的用户名不存在");

        // 判断密码是否相同
        let compare = bcrypt.compareSync(userinfo.password, result[0].password);
        if (!compare) return res.cc("密码输入错误，登入失败");

        // 用ES6语法快速剔除密码和头像的值
        const user = {...result[0], password: '', user_pic: '' };
        // 生成token值
        let tokenStr = jwt.sign(user, jwtsecretkey, { expiresIn: '10h' });

        // 将值发送给客户
        res.send({
            status: 0,
            message: '登入成功',
            // 为了方便客户端使用token直接在tokenStr前面拼接'Bearer '
            token: 'Bearer ' + tokenStr,
        });
    });
}