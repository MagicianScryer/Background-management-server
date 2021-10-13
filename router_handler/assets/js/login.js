$(function() {
    // 切换登录和注册页面
    $("#link_reg").on("click", function() {
        $(".login-box").hide().siblings(".reg-box").show();
    });
    $("#link_login").on("click", function() {
        $(".reg-box").hide().siblings(".login-box").show();
    });

    // 从lay-ui 获取到一个form对象
    let form = layui.form
    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        equality: function(value, item) {
            if (value !== $('#newpassword').val()) {
                return '两次的密码不一致';
            }
        }
    });

    let layer = layui.layer;
    // 为注册表单发起ajax请求
    $("#regform").on("submit", function(e) {
        // 阻止默认的提交方式
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            type: "POST",
            url: "http://api-breakingnews-web.itheima.net/api/reguser",
            data: {
                username: $("#newusername").val(),
                password: $("#newpassword").val(),
            },
            success: function(response) {
                if (response.status !== 0) {
                    layer.msg(response.message);
                } else if (response.status == 0) {
                    layer.msg("注册成功请登入");
                    $("#link_login").click();
                }
            }
        });
    });

    // 为登入表发起的ajax请求
    $("#loginform").on("submit", function(e) {
        e.preventDefault();
        // 发起ajax登录请求
        $.ajax({
            type: "POST",
            url: "http://api-breakingnews-web.itheima.net/api/login",
            data: $(this).serialize(),
            success: function(response) {
                if (response.status !== 0) {
                    return layer.msg(response.message);
                } else if (response.status == 0) {
                    // 将登入的身份验证放到localtorage
                    localStorage.setItem('token', response.token);
                    location.assign('../../index.html');
                }
            }
        });

    });
});