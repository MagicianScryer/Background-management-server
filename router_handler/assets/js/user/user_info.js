var layer = layui.layer; //引入layui提供的弹出层
let form = layui.form; //引入类ui的form
$(function() {

    form.verify({
        nickname: function(value, item) {
            if (value.length > 6) {
                return '昵称长度为1-6个字符';
            }
        }
    });

    user_info_load();

    // 设置重置按钮
    $("#reset").on("click", function(e) {
        e.preventDefault();
        user_info_load();
    });

    // 设置提交修改按钮
    $("#initform").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),

            success: function(res) {
                if (res.status == 0) {
                    layer.msg(res.message);
                    user_info_load();
                    // 调用父页面的方法从新渲染页面
                    window.parent.gitbaseinfo();
                } else {
                    layer.msg("修改用户信息失败");
                }
            }
        });
    });
});

// 渲染基本信息页面
function user_info_load() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg("导入基本信息失败");
            }
            form.val('initform', res.data);
        }
    });
}