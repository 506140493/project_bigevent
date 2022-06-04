$(function () {
    var form = layui.form;
    form.verify({
        nickname: [/^[\S]{1,10}$/, '非空字符串、长度 1-10']
    })
    initUserInfo();

    // 重置按钮的复写
    $('#btnReset').on('click', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 重新初始化数据
        initUserInfo();
    })
    // 提交更改信息，并且获取最新的用户信息
    $('.layui-form').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // ajax提交信息
        $.ajax({
            method: 'PUT',
            url: 'my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                // 新解锁：调用父页面中的方法， 重新渲染用户的头像和信息
                window.parent.getUserInfo();
            }
        })
    })
})
// 初始化用户基本信息
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: 'my/userinfo',
        success: function (res) {
            if (res.code !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            console.log(res);
            // 新解锁：layui 表单赋值 / 取值
            // 调用layui里的form.value()快速为表单赋值
            layui.form.val('formUserInfo', res.data)
        }
    })
}

