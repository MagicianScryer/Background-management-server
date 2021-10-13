// 提供文章类别管理路由函数模块
// 导入数据库
const db = require('../db/index');

// 获取文章类别列表
exports.getArticleCates = (req, res) => {
    // 请求数据库中的文章分类列表
    let selectSQL = 'select * from ev_article_cate';
    db.query(selectSQL, (err, results) => {
        if (err) return res.cc(err.message);
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: results,
        });
    });
}

// 新增文章类别
exports.addArticleCates = (req, res) => {
    // 查询别名和类名是否被占用
    let selectSQL = 'select * from ev_article_cate where name = ? or alias = ?';
    db.query(selectSQL, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err.message);
        if (results.length === 2) return res.cc("文章名字和文字别名都被占用，请更换后重试");
        if (results.length === 1 && results[0].name == req.body.name) return res.cc("文章名字被占用，请更换后重试");
        if (results.length === 1 && results[0].alias == req.body.alias) return res.cc("文字别名被占用，请更换后重试");

        // 向数据库中插入新的文章类别
        let insertSQL = 'insert into ev_article_cate set ?';
        db.query(insertSQL, req.body, (err, result) => {
            if (err) return res.cc(err.message);
            if (result.affectedRows !== 1) return res.cc('插入文章类别失败');
            res.cc('插入文章类别成功', 0);
        });
    });
}

// 根据id删除文章分类的路由函数
exports.deleteCateById = (req, res) => {
    // 实现标记删除的功能
    let deletSQL = 'update ev_article_cate set is_delete = 1 where id = ?';
    db.query(deletSQL, req.params.id, (err, result) => {
        if (err) return res.cc(err.message);
        if (result.affectedRows !== 1) return res.cc("删除数据失败");
        res.cc("删除数据成功", 0);
    });
}

// 根据id获取文章数据
exports.getArticleById = (req, res) => {
    // 获取id对应的文章类别内容
    let selectSQL = 'select id, name, alias, is_delete from ev_article_cate where id = ?';
    db.query(selectSQL, req.params.id, (err, result) => {
        if (err) return res.cc(err.message);
        if (result.length !== 1) return res.cc('获取失败');
        res.send({
            status: 0,
            message: '获取文章类别成功',
            data: result[0]
        });
    });
}

// 根据id更新文章类别数据
exports.updateCateById = (req, res) => {
    // 执行name alias 的查重操作
    let selectSQL = 'select * from ev_article_cate where name = ? or alias = ?';
    db.query(selectSQL, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err.message);
        // 判断 分类名称 和 分类别名 是否被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // 更新数据库的文章类别信息
        let updataSQL = 'update ev_article_cate set ? where id = ?';
        db.query(updataSQL, [req.body, req.body.id], (err, result) => {
            if (err) return res.cc(err.message);
            if (result.affectedRows !== 1) return res.cc('更新文章数据失败');
            res.cc('更新文章数据成功', 0);
        });
    });
}