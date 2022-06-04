$(function () {
    layui.form.verify({
        password: [/^[\S]{6,15}$/, '非空字符串、长度 6-15'],
        new_password: function (value) {
            if (value === $('[name=old_pwd]').val()) {
                return '新旧密码不能一致';
            }
        },
        re_pwd: function (value) {
            if (value !== $('[name=new_pwd]').val()) {
                return '密码必须一致';
            }
        }
    })

    // 提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'PATCH',
            url: 'my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                // 重制表单
                $('.layui-form')[0].reset();
            }
        })
    })
})