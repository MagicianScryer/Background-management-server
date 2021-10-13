$(function() {
    let layer = layui.layer;
    let form = layui.form;
    // 表单select初始化函数
    initArtClass();
    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 未选择封面的按钮绑定input：file表单
    $("#btnBFile").on("click", function() {
        $("#btnFile").click();
    });

    // 初始化formdata
    localStorage.getItem('art') && initFd();
    // 为input：files实现功能
    $("#btnFile").on("change", function(e) {
        // 判断是否选择了文件
        if (e.target.files.length == 0) {
            return layer.msg("请选择文件");
        }
        //  更换裁剪的图片
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 获取表单选择文章类的函数
    function initArtClass() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            data: "data",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var htmlStr = template('optionHtml', res);
                $("#cate_idslt").html(htmlStr);
                form.render();
            }
        });
    }

    // 定义format数据
    var art_state = '已发布';

    // 为草稿按钮绑定事件
    $("#cg").on('click', function(e) {
        art_state = '草稿';
    });

    // 为表单绑定submit事件
    $("#crearArt").on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 为表单创建一个formdata对象
        var fd = new FormData($(this)[0]);
        // 将文章的状态存入fd中
        fd.append("state", art_state);
        //将裁剪后的图片， 输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                fd.set("cover_img", blob);
                // 发布文章
                artAdd(fd)
            })

    });

    // 发布文章函数
    function artAdd(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 由于是发表formdata类型的数据则必须是
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                location.assign("/article/ariticle_list.html");
            }
        });
    }

    // 定义初始化表格数据的函数
    function initFd() {
        var data = JSON.parse(localStorage.getItem('art'));
        data.cover_img = '';
        form.val("putArt", data)
        form.render();
        localStorage.removeItem('art');
    }
});