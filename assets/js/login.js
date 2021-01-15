
// ---------------------- 切换两个盒子 ----------------------
$('.login a').on('click', function () {
    $('.login').hide().next().show();
});

$('.register a').on('click', function () {
    $('.login').show().next().hide();
});


// ----------------------   注册功能  ----------------------
// 表单提交 -> 阻止默认行为 -> 收集表单数据（查询字符串） -> ajax提交
$('.register form').on('submit', function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    // console.log(data);
    $.ajax({
        type: 'POST',
        url: '/api/reguser',
        data: data,
        success: function (res) {
            // 提示
            layer.msg(res.message);
            if (res.status === 0) {
                // 清空输入框。找到表单，转成DOM对象，调用DOM方法reset，来重置表单
                $('.register form')[0].reset();
                // 切换到登录的盒子
                $('.login').show().next().hide();
            }
        }
    })
});


// ----------------------   自定义表单验证  ----------------------
// 必须使用 layui 的内置模块 - form 模块
// 只要使用layui的模块，必须加载模块
var form = layui.form;  // 加载form模块
// var laypage = layui.laypage; // =加载laypage分页模块
// var tree = layui.tree; // 加载树形组件模块

// 调用 form 模块内置方法verify，自定义验证规则
form.verify({
    // 键(验证规则): 值(验证方法)
    
    // 比如验证用户名长度2~10位，只能是数字字母组合
    // user: [/正则表达式/, '验证不通过时的提示']
    user: [/^[a-zA-Z0-9]{2,10}$/, '用户名只能是数字字母，且2~10位'], // {2,10} 不是 {2, 10}

    len: [/^\S{6,12}$/, '密码6~12位且不能有空格'],

    same: function (val) {
        // 形参，表示使用该验证规则的输入框的值（谁用这个验证规则，val表示谁的值）
        // 案例中，重复密码使用了这个验证规则，所以形参val表示输入的重复密码
        if (val !== $('.pwd').val()) {
            // return '错误提示'
            return '两次密码不一致'
        }
    }
    
});