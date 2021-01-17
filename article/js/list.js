// 获取文章的请求参数
var data = {
  pagenum: 1, // 表示页码值，即获取第 n 页的数据
  pagesize: 2, // 表示每页显示几条数据
}

// 定义模板引擎的过滤器函数
template.defaults.imports.dateFormat = function (time) {
  // console.log(time); // 2021-01-16T08:40:41.000Z
  var date = new Date(time);
  var y = date.getFullYear();
  var m = addZero(date.getMonth() + 1);
  var d = addZero(date.getDate());
  return y + '-' + m + '-' + d;
}
// 补零函数
function addZero(n) {
  return n < 10 ? '0' + n : n;
}

// ---------------------------- 获取文章列表，渲染 ------------------------
function renderArticle() {
  $.ajax({
    url: '/my/article/list',
    data: data,
    success: function (res) {
      console.log(res)
      // 调用模板引擎，渲染数据
      var str = template('tpl-article', res);
      $('tbody').html(str);
      // res.total 表示数据总数
      // 当ajax请求成功后，然后再实现分页
      showPage(res.total);
    }
  });
}
renderArticle();



// ---------------------------- 使用layui的分页模块 ------------------------
var laypage = layui.laypage;
function showPage(t) {
  //执行一个laypage实例
  laypage.render({
    elem: 'page', // 注意，这里的 test1 是 ID，不用加 # 号
    count: t, // 数据总数，从服务端得到
    limit: data.pagesize, // 每页显示几条数据
    curr: data.pagenum, // 当前页，比如3，效果就是让第3页背景绿色，表示选中
    limits: [2, 3, 5, 10], // 下拉框中的条数

    layout: ['limit', 'prev', 'page', 'next', 'count', 'skip'], // 自定义排版

    // 分页的回调（showPage调用时触发第1次；后续点击页码还会触发）
    jump: function (obj, first) {
      //obj包含了当前分页的所有参数，比如：
      // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
      // console.log(obj.limit); // 得到每页显示的条数
      // 首次不执行
      if (!first) {
        // do something
        // 修改当前页码
        data.pagenum = obj.curr; // 比如点了3，obj.curr=3; 把3赋值给ajax请求参数
        // 修改每页显示的条数
        data.pagesize = obj.limit; // 比如修改了每页显示5条，及时更新ajax请求参数
        renderArticle();
        // console.log('hello')
      }
    }
  });
}


// -------------------------- 筛选 ------------------------------
var form = layui.form;
// 1. 获取真实的分类，渲染到下拉框的位置
$.ajax({
  url: '/my/category/list',
  success: function (res) {
    // console.log(res)
    var str = template('tpl-category', res);
    // $('#category').append(str);
    $('#category').html(str);
    // 更新渲染
    // form.render('select', 'lay-filter属性值');
    form.render('select');
  }
})

