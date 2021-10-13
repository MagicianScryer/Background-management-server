// 拿到layui的一些值
let layer = layui.layer;
let form = layui.form;
// 定义请求数据
let q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
};


$(function() {

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        let myDate = new Date(date);

        // 获取年月日
        var y = myDate.getFullYear();
        var m = zero(myDate.getMonth() + 1);
        var d = zero(myDate.getDate());
        // 获取时分秒
        var hh = zero(myDate.getHours());
        var mm = zero(myDate.getMinutes());
        var ss = zero(myDate.getSeconds());

        return `${y}年${m}月${d}  ${hh}:${mm}:${ss}`;
    }

    // 定义一个补零函数
    function zero(n) {
        return n < 10 ? '0' + n : n
    }

    // 获取文章列表
    gitArtList(q);

    // 响应文章分类的数据
    gitArtClass();
    // 调用分类的方法

    // 实现筛选功能
    $("#formFilter").on("submit", function(e) {
        e.preventDefault();
        var cate_idval = $('[name="cate_id"]').val(); //select可以这样获取数据
        var stateval = $('[name="state"]').val();
        q.cate_id = cate_idval;
        q.state = stateval;
        gitArtList(q);
    });

    // 用事件委托绑定删除功能
    $("tbody").on("click", ".deletBtn", function() {
        var id = $(this).attr('date-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示', offset: ['300px', '600px'] }, function(index) {
            //do something
            // 获取按钮的长度
            var btnNum = $(".deletBtn").length;
            console.log(btnNum);
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg("删除成功");
                    // 当数据删除完成后需要判断是否还有数据
                    if (btnNum == 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    gitArtList(q)
                }
            });
            layer.close(index);
        });
    });

    // 用事件委托功能绑定编辑功能
    $("tbody").on("click", ".editBtn", function() {
        var id = $(this).attr("date-id");
        $.ajax({
            type: "GET",
            url: "/my/article/" + id,
            success: function(res) {
                var str = JSON.stringify(res.data);
                localStorage.setItem('art', str);
                location.assign('/article/article_put.html');
            }
        });
    });

});

function gitArtList(q) {
    $.ajax({
        type: "GET",
        url: "/my/article/list",
        data: q,
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg("获取文章列表失败");
            }
            var htmlStr = template('art_list_html', res);
            $('tbody').html(htmlStr);
            // 调用分页的方法
            renderPag(res.total);
        }
    });
};

// 初始化文章分类的方法
function gitArtClass() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取分类数据失败！');
            }
            // 调用模板引擎渲染分类的可选项
            var htmlStr = template('art_Class', res);
            $("[name='cate_id']").html(htmlStr);
            // 通过 layui 重新渲染表单区域的UI结构
            // 通知类ui从新渲染结构
            form.render()
        }
    })
};

// 定义渲染分页的方法
function renderPag(total) {
    layui.use('laypage', function() {
        var laypage = layui.laypage;

        //执行一个laypage实例
        // 只要调用laypage.render方法就会调用jump
        // 第一次触发的值为first = true 点击其他页面分页first = undefined
        // 切换条目也会触发jump回调
        laypage.render({
            elem: 'test1' //注意，这里的 test1 是 ID，不用加 # 号
                ,
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示数据
            curr: q.pagenum, //设置默认被选中的分页
            limits: [2, 3, 5, 7, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                if (!first) { //只要第一次不触发就不会造成死循环递归
                    q.pagenum = obj.curr;
                    q.pagesize = obj.limit;
                    // 根据最新的q返回列表的值
                    gitArtList(q);
                }
            }
        });
    });
}