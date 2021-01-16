// ---------------------- 1. 初始化剪裁插件 ---------------------------
// 1.1 找到图片
var $image = $('#image');
// 1.2 写一个配置项
var option = {
    // 剪裁框的宽高比
    aspectRatio: 1,
    // 指定预览的容器
    preview: '.img-preview'
};
// 1.3 调用cropper方法，初始化
$image.cropper(option);


// --------------- 2. 点击选择头像，能够实现选择图片 --------------------
$('#chooseFile').on('click', function () {
    $('#file').trigger('click');
})

// --------------- 3. 文件域内容改变了，能够更换剪裁区的图片 -------------
$('#file').on('change', function () {
    // console.log(12)
    if (this.files.length > 0) {
        // 3.1 找到文件对象
        // console.dir(this);
        var fileObj = this.files[0];
        // 3.2 为文件对象创建临时的url
        var url = URL.createObjectURL(fileObj);
        // console.log(url);
        // 3.3 更换剪裁区的图片(销毁剪裁框 --> 更换图片 --> 重新生成剪裁框)
        $image.cropper('destroy').attr('src', url).cropper(option);
    }
});


// --------------- 4. 点击确认修改按钮，实现更换头像 ------------------
$('#sure').on('click', function () {
    // 1. 剪裁图片，得到canvas
    var canvas = $image.cropper('getCroppedCanvas', {width: 30, height: 30});
    // 2. 把canvas转成base64格式字符串
    var base64 = canvas.toDataURL();
    // console.log(base64)
    // 3. ajax提交即可
    $.ajax({
        type: 'POST',
        url: '/my/user/avatar',
        data: { avatar: base64 }, // { id: 1 }
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                // 更新index.html的头像
                window.parent.getUserInfo();
            }
        }
    })
})