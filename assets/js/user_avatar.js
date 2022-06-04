$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击上传，可以弹出file的选择文件框
    $('#btnChoosePic').on('click', function () {
        $('#file').click();
    })

    // 绑定change事件
    $('#file').on('change', function (e) {
        var filelist = e.target.files;
        console.log(filelist);
        if (filelist.length === 0) {
            return layui.layer.msg('请选择图片!')
        }
        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 给btnUpload绑定点击事件
    $('#btnUpload').on('click', function () {
        // 1. 获取图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            }).toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2. 发起ajax请求
        $.ajax({
            method: 'PATCH',
            url: 'my/update/avatar',
            data: { avatar: dataURL },
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                // 重新渲染页面
                window.parent.getUserInfo();
            }
        })

    })
})