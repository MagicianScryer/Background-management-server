$(function() {
    // 注意每次调用ajax的时候会先调用这个ajaxPrefilter方法
    // 在这里可以拿到配置对象
    // ajax预处理方法由jQuery提供
    $.ajaxPrefilter(function(options) {
        // 拼接url地址
        options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
        // 统一为有权限的接口设置headers值 
        if (options.url.indexOf('/my') !== -1) {
            options.headers = {
                    Authorization: localStorage.getItem('token') || '',
                }
                // 权限限制当为登录的时候不允许用户进入index页面
            options.complete = function(res) {
                // res.responseJSON拿到服务器响应的数据
                if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
                    // 强制清空token
                    localStorage.removeItem("token");
                    // 强制返回登录页
                    location.assign('/login.html');
                }
            };
        }
    });
});