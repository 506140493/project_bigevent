// 每次调用$.get $.post() $.ajax()的时候，会先调用ajaxPrefilter（）这个函数
// 在这个函数中，我们可以拿到 我们给ajax提供的配置对象options
$.ajaxPrefilter(function (options) {
    console.log(options);
    // 在真正发起ajax请求前， 统一拼接请求的url
    options.url = 'http://www.liulongbin.top:3008/' + options.url;
    console.log(options);

}) 