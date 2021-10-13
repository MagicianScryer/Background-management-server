$(function() {
    gitbaseinfo(); //调用此函数获取用户基本信息
    let layer = layui.layer;
    // 添加退出功能
    $("#quit").on("click", function() {
        // 提示用户确定退出
        layer.confirm('确认要退出吗', function(index) {
            // 清除localStorage内的token
            // 退出后到那个页面

            localStorage.removeItem('token');
            location.assign('/login.html');

            // 关闭confirm
            layer.close(index);
        });
    });
});

function gitbaseinfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status == 0) {
                renderdata(res.data); //调用了渲染头像的函数
            } else {
                return layui.layer.msg("获取用户信息失败");
            }
        }
    });
}

function renderdata(data) {
    let uname = data.nickname || data.username;
    // 设置欢迎的文本
    $("#welcome").text(`欢迎  ${uname}`);

    // 渲染头像
    if (data.user_pic) {
        $(".layui-nav-img").prop('src', data.user_pic).show();
        $(".text-avatar").hide();
    } else {
        let first = uname[0].toUpperCase();
        $(".text-avatar").show().text(first);
        $(".layui-nav-img").prop('src', '').hide();
    }
}