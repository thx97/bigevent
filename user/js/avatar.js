// ---------------------- 1. 初始化剪裁插件 ---------------------------
// 1.1 找到图片
var $image = $('#image');
// 1.2 写一个配置项
var option = {
    // 剪裁框的宽高比
    aspectRatio: 1,
    // 指定预览的容器
    preview: '.img-preview'
};
// 1.3 调用cropper方法，初始化
$image.cropper(option);
