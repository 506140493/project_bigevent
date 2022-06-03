$(function () {
    // 点击去注册账号，显示注册div，隐藏登陆div
    $('#reg-btn').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    })

    // 点击去登陆，隐藏注册div，显示登陆div
    $('#login-btn').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify() 函数来自定义校验规则
    form.verify({
        // 自定义一个叫 pwd 的校验规则
        pwd: [/^[\S]{6,15}$/, '非空字符串、长度 6-15'],

        // 自定义一个 repwd 的校验规则
        repwd: function (value, item) {     //value：表单的值、item：表单的DOM对象
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码输入不一致';
            }
        },
        // 对用户名 定义一个 uname 校验规则
        uname: [/^[\w]{1,10}$/, '用户名必须为 字母数字、长度 1-10']
    })

    // 注册按钮添加点击事件
    $("#form_reg").on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // ajax发起post请求
        $.ajax({
            method: 'POST',
            url: 'api/reg',
            data: {
                username: $('#form_reg [name=uname]').val(),
                password: $('#form_reg [name=password]').val(),
                repassword: $('#form_reg [name=repassword]').val()
            },
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功');
                $('#login-btn').click();
            }
        })
    })
    // 登陆按钮添加点击事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 保存 token 参数 后面身份验证用
                localStorage.setItem('token', res.token);
                // 跳转到后台index页面
                location.href = 'index.html';
            }
        })
    })



})
