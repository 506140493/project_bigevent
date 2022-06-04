$(function () {
    getUserInfo();

    // 退出登陆
    $('#btnLogout').on('click', function () {
        layui.layer.confirm('确定退出登陆?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清空本地存储的token数据
            localStorage.removeItem('token');
            // 跳转到login页面
            location.href = 'login.html';
            layer.close(index);
        });
    })
})

// 获取用户信息函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: 'my/userinfo',
        success: function (res) {
            // console.log(res)
            if (res.code !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data);
        }
    })
}

// 渲染用户头像函数
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username;
    // 渲染用户名
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 如果没有头像, 则使用文字头像, 
    if (user.user_pic !== null) {
        // 如有有头像，则隐藏文字头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        $('.text-avatar').html(name[0].toUpperCase()).show();
        $('.layui-nav-img').hide();
    }
}