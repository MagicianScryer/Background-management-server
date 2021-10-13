// 文章管理发表的路由函数模块

// 导入路径处理模块
const path = require('path');
const db = require('../db');

exports.addArticle = (req, res) => {
    // 手动判断是否传入了图片封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必填项，请选择文件');

    // 设置存入数据库的数据
    const articleinfo = {
        ...req.body,
        cover_img: path.join(__dirname, '../uplodes', req.file.filename),
        pub_date: new Date(),
        author_id: req.user.id,
    }

    // 将文章信息存入数据库
    let insert_intoSQL = 'insert into ev_articles set ?';
    db.query(insert_intoSQL, articleinfo, (err, result) => {
        if (err) return res.cc(err.message);

        if (result.affectedRows !== 1) return res.cc('发表文章失败');

        res.cc('发表文章成功', 0);
    });
}