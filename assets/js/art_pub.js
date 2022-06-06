$(function () {
    var form = layui.form;      //只有执行了这一步，部分表单元素才会自动修饰成功
    layui.use('form', function () {
        //如果你的 HTML 是动态生成的，自动渲染就会失效
        //因此你需要在相应的地方，执行下述方法来进行渲染
        form.render();
    })
    // 初始化 文章分类列表
    function initCateList() {
        $.ajax({
            method: 'GET',
            url: 'my/cate/list',
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                var htmlStr = template('tpl-catelist', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    initCateList();
    // 初始化富文本编辑器
    initEditor();
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击 选择封面 按钮 触发隐藏的file事件
    $('#btnChoosePic').on('click', function () {
        $('#coverFile').click();
    })
    // 监听 coverFile 的change事件 获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的图片
        var file = e.target.files[0];
        if (file.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 状态默认为已发布
    var state = '已发布'
    // 当点击btnSave2时 状态为草稿
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })
    // 获取表单数据 FormData 绑定submit事件
    $('#form_pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', state);
        // 将图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // 发起ajax请求
                publishArticle(fd);
            })
    })

    // 定义一个发布新文章的函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: 'my/article/add',
            data: fd,
            // 不修改content-type属性, 使用formdata默认的content-type属性
            contentType: false,
            // 不对fd数据进行url编码, 而是将fd原数据发给数据库
            processData: false,
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                location.href = 'art_list.html';
                layui.layer.msg(res.message);
            }
        })
    }
})