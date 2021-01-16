// --------------------------  获取用户信息，渲染到头像区域 ---------------------
// 封装成函数，肯定会多次调用(修改昵称后、修改头像后)
function getUserInfo() {
    $.ajax({
        url: '/my/user/userinfo',
        success: function (res) {
            // console.log(res);
            if (res.status === 0) {
                // 1. 设置欢迎你，xxx(优先使用昵称)
                var name = res.data.nickname || res.data.username;
                $('.username').text(name);

                // 2. 设置头像（优先使用图片）
                if (res.data.user_pic) {
                    // 说明有图片
                    $('.layui-nav-img').attr('src', res.data.user_pic).show();
                    $('.text-avatar').hide();
                } else {
                    // 说明没有图片(截取名字的第一个字，转大写)
                    var first = name.substr(0, 1).toUpperCase();
                    // show方法作用是恢复元素默认的样式（span默认就是行内元素，show会把span设置为display:inline；div默认是块级元素，show会把div设置为display: block）
                    $('.text-avatar').text(first).css('display', 'inline-block');
                }
            }
        }
    });
}
getUserInfo();




// --------------------------           退出            ---------------------
$('#logout').on('click', function (e) {
    e.preventDefault(); // 保证点击之后不会跳转
    // 询问是否退出
    layer.confirm('你确定要退出吗？', function (index) {
        // do something
        // 删除token
        localStorage.removeItem('token');
        // 跳转到登录页
        location.href = './login.html';

        // 关闭弹层
        layer.close(index);
    });
    
});