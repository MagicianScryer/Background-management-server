$(function() {
    let layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
        // 更换图片
    $("#commit").on("click", function(e) {
        $("#avatarinpt").click();
    });

    // 为文件选择框绑定change事件
    $("#avatarinpt").on("change", function(e) {
        if (e.target.files.length < 1) return layer.msg("请选择文件");
        var files = e.target.files[0];
        var newImgURL = URL.createObjectURL(files)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 确定按钮上传文件到服务器
    $("#submit").on("click", function(e) {
        e.preventDefault();
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: { avatar: dataURL },
            success: function(res) {
                if (res.status == 0) {
                    window.parent.gitbaseinfo();
                    return layer.msg("更换头像成功");

                } else {
                    return layer.msg("更换头像失败");
                }
            }
        });
    });
});