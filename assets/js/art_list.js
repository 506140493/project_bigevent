$(function () {
    var form = layui.form;
    var laypage = layui.laypage;
    layui.use('form', function () {
        // var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
        //如果你的 HTML 是动态生成的，自动渲染就会失效
        //因此你需要在相应的地方，执行下述方法来进行渲染
        form.render();
    });
    // 定义一个查询参数对象 将来请求数据的时候 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,     // 页码值 默认请求第一页数据
        pagesize: 2,    // 每页显示几条数据 默认显示两条数据
        cate_id: '',    // 文章分类的id
        state: ''       // 文章的发布状态
    };
    // 初始化 文章的列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: 'my/article/list',
            data: q,
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }
    initTable();

    // 定义一个格式化事件的过滤器
    template.defaults.imports.dataFormat = function (data) {
        var date = new Date(data);
        const arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        const year = padZero(date.getFullYear());
        const month = padZero(date.getMonth() + 1);
        const dates = padZero(date.getDate());
        const hour = padZero(date.getHours());
        const minute = padZero(date.getMinutes());
        const second = padZero(date.getSeconds());
        const day = padZero(date.getDay());
        return year + '-' + month + '-' + dates + ' ' + hour + ':' + minute + ':' + second;
    }
    // 定义一个补零的函数
    function padZero(n) {
        return n > 10 ? n : '0' + n;
    }
    // 定义一个 初始化下拉列表框数据的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: 'my/cate/list',
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    initCate();
    // 实现筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 将查询的值赋值给q，q查询参数对象
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的q筛选
        initTable();
    })
    // 定义一个 渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',    // 注意，这里的 test1 是 ID，不用加 # 号
            count: total,       // 数据总数，从服务端得到
            limit: q.pagesize,   // 每页显示的条数
            limits: [2, 5, 8, 6, 10],
            curr: q.pagenum,      // 起始页。一般用于刷新类型的跳页以及HASH跳页
            // 当分页被切换时触发 jump回调函数
            // 触发jump回调函数，有两种方式：
            // 1. 点击页码的时候，会触发jump回调函数, first的值为undefined
            // 2. 调用laypage.render()函数的时候，就会触发jump回调函数, first的值为true
            jump: function (obj, first) {
                // 可以通过first的值来判断 是通过哪种方式来触发jump回调函数的
                if (first == undefined) {
                    // 把最新的页码值 赋值给q
                    q.pagenum = obj.curr;
                    // 把最新的每页显示条数 赋值给q
                    q.pagesize = obj.limit;
                    initTable();
                }
            },
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
        });
    }
    // 给删除按钮 绑定click事件
    $('tbody').on('click', '#btn-del', function () {
        // 获取当前页面 删除按钮的个数
        var del_btn_num = $('.btn-del').length;
        var id = $(this).attr('index-id');
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'DELETE',
                url: 'my/article/info?id=' + id,
                success: function (res) {
                    if (res.code !== 0) {
                        return layui.layer.msg(res.message);
                    }
                    layui.layer.msg(res.message);
                    // 当删除按钮个数为1 说明点击确定之后，当前页面数据为0 页码值需要-1
                    if (del_btn_num - 1 <= 0) {
                        // 页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                    layer.close(index);
                }
            })


        });

    })
    // 给预览按钮 绑定click事件
    $('tbody').on('click', '#btn-preview', function () {
        var id = $(this).siblings('.btn-del').attr('index-id');
        indexEdit = layer.open({
            type: 1,
            area: ['700px', '600px'],
            title: '修改文章分类',
            content: $('#dialog-preview').html()
        })
        $.ajax({
            method: 'GET',
            url: 'my/article/info',
            data: { id: id },
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg(res.message);
                }
                var htmlStr = template('dialog-preview', res.data);
                $('#data-big').html(htmlStr);
            }
        })
    })
    // 定义一个 过滤器
    template.defaults.imports.DateFormat = function (data) {
        var date = new Date(data);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const dates = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        return year + '-' + month + '-' + dates + ' ' + hour + ':' + minute + ':' + second;
    }
    // 再定义一个 过滤器
    template.defaults.imports.textFormat = function (data) {
        return $(data).html();
    }





})

