$(function() {
    let indexAdd = null;
    // 弹出层的名字
    let indexCompile = null;
    // 用于获取layui的layer
    let layer = layui.layer;
    // 用于获取layui的form
    let form = layui.form;
    // 用来获取文章分类的id
    let id = '';
    // 用来存储页面文章分类的数组
    let artileStr = {
        name: '',
        alias: ''
    };
    getartile(); //调用快速获取文章列表函数
    // 添加类别弹出层
    $("#btnAdd").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            offset: '50%,50%',
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $("#layerform").html() //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
        });
    });

    // 通过代理的形式完成添加功能
    $("body").on("submit", "#layer_open", function(e) {
        e.preventDefault();
        var data = $(this).serialize();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: data,
            success: function(res) {
                if (res.status !== 0) return layer.mas(res.message);
                getartile();
                layer.close(indexAdd);
                layer.msg(res.message);
            }
        });
    });
    layer.msg("文件的删除只能删掉自己创建的文件");
    // 通过代理为编辑按钮添加弹出框的功能
    // 此处文本的get方法对于-number无效
    $("tbody").on("click", "#compile", function() {
        id = $(this).attr('data-id');
        artileStr.name = $(this).parent().siblings('.name').html();
        artileStr.alias = $(this).parent().siblings('.alias').html();
        console.log(artileStr);

        indexCompile = layer.open({
            type: 1,
            offset: '50%,50%',
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $("#indexCompile").html(),
        });
        form.val('cplForm', artileStr);
    });
    // 通过代理为编辑弹出框添加修改功能
    $("body").on("submit", "#cplForm", function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize() + "&Id=" + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                getartile();
                layer.close(indexCompile);
            }
        });
    });

    // 通过代理删除固定文本
    $("tbody").on("click", "#delet", function() {
        id = $(this).attr('data-Id');
        layer.confirm('确定删除文件?', { icon: 3, title: '提示', offset: ['20%', '40%'] }, function(index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id, //接口出了问题我无法解决
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章失败");
                    }
                    console.log(res);
                    getartile();
                }
            });
            layer.close(index);
        });

    });

});
// 快速获取文章列表函数
function getartile() {
    $.ajax({
        type: "GET",
        url: "/my/article/cates",
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            var hml = template('table_tbody_content', res);
            $("tbody").html(hml);
        }
    });
}