// 定义个人中心的路由处理函数

// 导入数据库
const db = require('../db/index');

// 导入加密密码的模块
const bcrypt = require('bcryptjs');

// 获取个人信息的函数
exports.userinfo = (req, res) => {
    // 在数据库中查询信息
    const seletSQL = 'select id, username, nickname, email, user_pic from ev_users where id = ?';
    db.query(seletSQL, req.user.id, (err, result) => {
        if (err) return res.cc(err);
        // 判断是否有这个值
        if (result.length !== 1) return res.cc('无该用户信息');
        res.send({
            status: 0,
            message: "获取用户基本信息成功！",
            data: result[0]
        });
    });

}

// 更新用户的基本信息
exports.updata = (req, res) => {
    let updatSQL = 'update ev_users set ? where id = ?';
    db.query(updatSQL, [req.body, req.body.id], (err, result) => {
        if (err) return res.cc(err);
        if (result.affectedRows !== 1) return res.cc('更新用户失败');
        res.cc("用户信息更新成功", 0);
    })
}

// 重置密码
// 危险操作需要再次验证
exports.resetpwd = (req, res) => {
    // 查询用户的值是否存在与数据库
    let selectStr1 = 'select * from ev_users where id = ?';
    db.query(selectStr1, req.user.id, (err, result) => {
        if (err) return res.cc(err);
        if (result.length !== 1) return res.cc("无此用户更新密码失败");

        // 判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, result[0].password)
        if (!compareResult) return res.cc('原密码错误！')

        // 加密新密码
        req.body.newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        // 更新数据库的密码
        let uptatepwd = 'update ev_users set password = ? where id = ?';
        db.query(uptatepwd, [req.body.newPwd, req.user.id], (err, result) => {
            if (err) return res.cc(err.message);
            if (result.affectedRows !== 1) return res.cc("更新密码失败");
            res.cc("密码更新成功", 0);
        });
    });
}

// 更新头像的路由函数
exports.avater = (req, res) => {
    // 定义更新用户头像的语句
    let update_avater_sql = 'update ev_users set  user_pic= ? where id= ?';
    db.query(update_avater_sql, [req.body.avatar, req.user.id], (err, result) => {
        if (err) return res.cc(req.message);
        if (result.affectedRows !== 1) return res.cc("更新用户头像失败");
        res.cc("更新头像成功！", 0);
    });
}