// ---------------------- 获取地址栏的id参数 -------------------------
var id = new URLSearchParams(location.search).get('id');

// ---------------------- 更换内容区为富文本编辑器 ---------------------
initEditor(); // 调用函数，就会把 textarea 替换为富文本编辑器

// ---------------------- 获取分类，渲染到下拉框的位置 ------------------
var form = layui.form;
// 1. 获取真实的分类，渲染到下拉框的位置
$.ajax({
  url: '/my/category/list',
  success: function (res) {
    // console.log(res)
    var str = template('tpl-category', res);
    // $('#category').append(str);
    $('select[name=cate_id]').html(str);
    // 更新渲染
    // form.render('select', 'lay-filter属性值');
    form.render('select');

    // 等所有的分类渲染完成，才能获取当前文章详情，完成数据回填
    $.ajax({
      url: '/my/article/' + id,
      success: function (res) {
        // console.log(res);
        // 使用layui的 form.val()，快速完成数据回填
        form.val('article', res.data);
        // 先把 textarea 换成富文本编辑器，然后这里设置富文本编辑器的内容
        tinyMCE.activeEditor.setContent(res.data.content);
        // 更换剪裁区的图片（先销毁剪裁区 --> 换图片 --> 重新生成剪裁框）
        $image.cropper('destroy')
          .attr('src', baseUrl + '/' + res.data.cover_img)
          .cropper(options);
      }
    });
  }
});



// ------------------------ 封面图片处理 -----------------------------
// 1.1 初始化图片裁剪器
var $image = $('#image')
// 1.2 裁剪选项
var options = {
  aspectRatio: 400 / 280,
  preview: '.img-preview',
  autoCropArea: 1, // 让剪裁框铺满整个剪裁区
}
// 1.3 初始化裁剪区域
$image.cropper(options);

// 点击按钮，触发文件域的单击事件，能够选择图片
$('button:contains("选择封面")').on('click', function () {
  $('#file').trigger('click');
});

// 当文件域的内容改变的时候，更换剪裁区的图片
$('#file').on('change', function () {
  // 找到文件对象
  var fileObj = this.files[0];
  // 生成url
  var url = URL.createObjectURL(fileObj);
  // 更换剪裁区的图片（先销毁剪裁区 --> 换图片 --> 重新生成剪裁框）
  $image.cropper('destroy').attr('src', url).cropper(options);
})


// ------------------------ 完成修改文章 -----------------------------
$('form').on('submit', function (e) {
  e.preventDefault();
  // 收集表单数据
  var fd = new FormData(this); // 传入表单的DOM对象
  // 单独向 fd 中添加content
  fd.set('content', tinyMCE.activeEditor.getContent());
  // 对于图片来说，先剪裁，向fd中追加文件对象
  var canvas = $image.cropper('getCroppedCanvas', { width: 400, height: 280 });
  // 把canvas转成blob二进制形式
  canvas.toBlob(function (blob) {
    // 形参 blob，就是转换后的结果
    fd.append('cover_img', blob); // 把blob追加到fd中，会自动变为文件对象

    // 根据接口要求，在fd对象中，追加一个id
    fd.append('id', id);
    // ajax提交fd
    $.ajax({
      type: 'POST',
      url: '/my/article/update',
      data: fd,
      // 提交FormData对象，必须加下面两个选项
      contentType: false,
      processData: false,
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          // 修改成功，跳转到 文章列表页
          location.href = './list.html';
        }
      }
    })

    // 检查fd中有哪些值
    // fd.forEach(function (val, key) {
    //     console.log(key, val);
    // });
  });
})