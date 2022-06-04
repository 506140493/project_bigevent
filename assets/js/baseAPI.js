// 每次调用$.get $.post() $.ajax()的时候，会先调用ajaxPrefilter（）这个函数
// 在这个函数中，我们可以拿到 我们给ajax提供的配置对象options
$.ajaxPrefilter(function (options) {
    // 在真正发起ajax请求前， 统一拼接请求的url
    options.url = 'http://www.liulongbin.top:3008/' + options.url;
    // 统一为有权限的接口，设置headers请求头, 如果url中包含了/my/则需要添加headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    console.log(options);
    // 全局统一挂载 complete 回调函数
    // 无论成功还是失败，ajax都会调用 complete 回调函数
    options.complete = function (res) {
        if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空本地token数据
            localStorage.removeItem('token');
            // 强制跳转页面
            location.href = 'login.html';
        }
    }
}) 