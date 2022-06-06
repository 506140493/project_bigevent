$(function () {
    initArtCaseList();

    // 添加校验规则
    layui.form.verify({
        cateName: [/^[\S]{1,10}$/, '非空字符串、长度为 1-10'],
        cateAlias: [/^[\w]{1,15}$/, '只能是字母数字、长度为 1-15']
    })

    var indexAdd = null;
    // 给 添加类别 按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            // 新解锁，如果js脚本里面需要用到html数据，则可以在html的script type=text/html 里写数据，然后用jquery的html方法转换为字符串，这样会方便很多
            content: $('#dialog-add').html()
        })
    })

    // 通过事件委托的方式，给dialog-add表单添加submit事件
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'my/cate/add',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                initArtCaseList();
                layui.layer.msg(res.message);
                // 关闭弹出层
                layer.close(indexAdd);
            }
        })
    })

    // 通过事件委托给 btn_edit 按钮绑定点击事件
    var indexEdit = null;
    $('#data_box').on('click', '#btn_edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id_edit = $(this).attr('data-id');
        // 发起ajax请求，根据id获取文章分类数据
        $.ajax({
            method: 'GET',
            url: 'my/cate/info',
            data: { id: id_edit },
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                // layui.layer.msg(res.message);
                // console.log(res);
                // 快速填充表单数据
                layui.form.val('form_edit', res.data);
            }
        })
    })

    // 通过事件委托， 对表单 绑定submit事件
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'PUT',
            url: 'my/cate/info',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                initArtCaseList();
                // 关闭弹出框
                layui.layer.close(indexEdit);
            }
        })
    })

    // 通过事件委托，对 删除按钮绑定点击事件
    $('#data_box').on('click', '#btn_del', function () {
        var id_del = $(this).siblings('#btn_edit').attr('data-id');
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            //发起ajax请求 删除当前数据
            $.ajax({
                method: 'DELETE',
                // 注意 delete 中的data是不会自动拼接字符串，需要手动加上去
                url: 'my/cate/del?id=' + id_del,
                success: function (res) {
                    if (res.code !== 0) {
                        return layui.layer.msg(res.message);
                    }
                    layui.layer.msg(res.message);
                    initArtCaseList();
                    layer.close(index);
                }
            })
        });
    })
})

// 初始化渲染列表
function initArtCaseList() {
    $.ajax({
        method: 'GET',
        url: 'my/cate/list',
        success: function (res) {
            // console.log(res);
            if (res.code !== 0) {
                return layui.layer.msg(res.message);
            }
            // template模版引擎
            var htmlStr = template('data_list', res);
            // 渲染数据
            $('#data_box').html(htmlStr);
        }
    })
}