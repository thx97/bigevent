## 文章列表

### 准备工作

- 准备工作（创建页面、挂好链接、引入所需的css和js文件）

```html
<!-- 加载所需的js和css -->
<link rel="stylesheet" href="../assets/lib/layui/css/layui.css">
<link rel="stylesheet" href="./css/list.css">

<script src="../assets/lib/layui/layui.all.js"></script>
<script src="../assets/lib/jquery.js"></script>
<script src="../assets/lib/template-web.js"></script>
<script src="../assets/js/common.js"></script>
<script src="./js/list.js"></script>
```

### 页面布局 

- layui的卡片面板

- 筛选区
    - 找到 “页面元素 --> 表单 --> 目录 --> 组装行内表单”
    - 不需要的文字删除
    - 更换文本框为 下拉框和按钮
- 表格区
    - 自行复制代码，然后调整宽度、设置按钮
- 分页区
    - 一个 id为page的空div

完整的页面结构

```html
<div class="layui-card">
<div class="layui-card-header">文章列表</div>
<div class="layui-card-body">
  <!-- 内容区一 表单搜索区 start -->
  <form class="layui-form" action="">
    <div class="layui-form-item">

      <div class="layui-inline">
        <div class="layui-input-inline" style="width: 200px;">
          <select name="city" lay-verify="">
            <option value="">请选择一个城市</option>
            <option value="010">北京</option>
            <option value="021">上海</option>
            <option value="0571">杭州</option>
          </select>
        </div>

        <div class="layui-input-inline" style="width: 200px;">
          <select name="city" lay-verify="">
            <option value="">请选择一个城市</option>
            <option value="010">北京</option>
            <option value="021">上海</option>
            <option value="0571">杭州</option>
          </select>
        </div>
      </div>

      <div class="layui-inline">
        <div class="layui-input-inline" style="width: 100px;">
          <button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>
        </div>
      </div>

    </div>
  </form>
  <!-- 内容区一 表单搜索区 end -->

  <!-- 内容区二 表格区 start -->
  <table class="layui-table">
    <colgroup>
      <col width="40%">
      <col width="15%">
      <col width="15%">
      <col width="15%">
      <col>
    </colgroup>
    <thead>
      <tr>
        <th>文章标题</th>
        <th>分类</th>
        <th>发布时间</th>
        <th>状态</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>静夜思</td>
        <td>艺术</td>
        <td>2021-01-13 12:39:08</td>
        <td>已发布</td>
        <td>
          <button type="button" class="layui-btn layui-btn-xs">编辑</button>
          <button type="button" class="layui-btn layui-btn-xs layui-btn-danger">删除</button>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- 内容区二 表格区 end -->

  <!-- 内容区三 分页区 start -->
  <div id="page"></div>
  <!-- 内容区三 分页区 end -->
</div>
</div>
```

### 渲染数据

- 定义渲染文章列表的函数 （renderArticle）
- ajax请求参数，我们先定义成全局变量（后面还需要使用）
- 定义renderArticle函数，函数内容，发送ajax请求，获取数据，并调用template渲染

JS代码：

```js
// 分页获取文章列表的请求参数
var data = {
  pagenum: 1, // 页码值，比如2，将获取到第2页的数据
  pagesize: 2, // 每页有多少条数据，比如5，表示每页5条数据
  // cate_id: 1,
  // state: '已发布'
}

// ------------------ 获取文章并渲染到表格中 ------------------
function renderArticle() {
  $.ajax({
    url: '/my/article/list',
    data: data,
    success: function (res) {
      // console.log(res);
      // 使用模板引擎，渲染数据
      var htmlStr = template('tpl-article', res);
      $('tbody').html(htmlStr);
    }
  });
}
renderArticle();
```

HTML模板：

```html
<!-- 文章列表的模板 start -->
<script type="text/html" id="tpl-article">
  {{each data item}}
  <tr>
    <td>{{item.title}}</td>
    <td>{{item.cate_name}}</td>
    <td>{{item.pub_date}}</td>
    <td>{{item.state}}</td>
    <td>
      <a href="./edit.html?id={{item.id}}" class="layui-btn layui-btn-xs">编辑</a>
      <button type="button" class="layui-btn layui-btn-xs layui-btn-danger">删除</button>
    </td>
  </tr>
  {{/each}}
</script>
<!-- 文章列表的模板 end -->
```

### 定义模板引擎过滤器函数

使用自定义函数，处理时间日期

```js
template.defaults.imports.dateFormat = function (time) {
  var date = new Data(time);
  var y = date.getFullYear();
  var m = addZero(date.getMonth() + 1);
  var d = addZero(date.getDate());
  // 时分秒自己写
  return y + '-' + m + '-' + d;
}

// 补零函数
function addZero (n) {
  return n < 10 ? '0' + n : n;
}
```

模板中使用自定义的过滤器函数处理时间

```html
<td>{{item.pub_date | dateFormat}}</td>
```



## 删除文章

- 给删除按钮，添加一个data-id属性，值就是当前文章的id，添加一个类 delete

    ```html
    <button data-id="{{item.id}}" type="button" class="delete layui-btn layui-btn-xs layui-btn-danger">删除</button>
    ```

- JS代码中，事件委托的方案，给删除注册单击事件

- 事件内部，获取id

- 询问是否要删除

- 如果确定删除，则发送ajax请求，完成删除

- 完成删除之后，从新渲染页面

> 这里的id参数，是一种url参数，只需要在接口后面 连接 上id即可。
>
> 比如：/my/article/delete/2   表示删除id为2的文章。

完整的代码：

```js
// -------------------------- 删除 ------------------------------
$('tbody').on('click', 'button:contains("删除")', function () {
  var id = $(this).data('id');
  layer.confirm('确定删除吗？', function (index) {

    $.ajax({
      // url: '/my/article/delete/2',
      url: '/my/article/delete/' + id,
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          renderArticle();
        }
      }
    });

    layer.close(index); // 关闭弹层
  });
})
```

另外一个删除思路，当前页的文章删没了，我们显示上一页的数据。

- 当确定删除了，首先用dom的方式，把tr移除。
- 当删除的请求成功后，判断tbody里面是否有tr
  - 如果有tr，那么还获取当前页的数据
  - 如果没有tr，说明当前页的数据被删没了，则 修改 pagenum--，获取上一页的数据

```js
// -------------------------- 删除 ------------------------------
$('tbody').on('click', 'button:contains("删除")', function () {
  var id = $(this).data('id');
  var that = $(this);
  layer.confirm('确定删除吗？', function (index) {

    // 使用dom的方式删除该行
    that.parents('tr').remove();

    $.ajax({
      // url: '/my/article/delete/2',
      url: '/my/article/delete/' + id,
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          if ($('tbody').children().length > 0) {
            renderArticle();
          } else {
            data.pagenum--;
            if (data.pagenum === 0) return;
            renderArticle();
          }
        }
      }
    });

    layer.close(index); // 关闭弹层
  });
})
```



## 添加文章

### 准备工作

创建html、css、js文件；

链接好所需的css和js文件

index.html 侧边栏挂好链接

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>发布文章</title>
  <!-- 加载所需的js和css -->
  <link rel="stylesheet" href="../assets/lib/layui/css/layui.css">
  <link rel="stylesheet" href="../assets/lib/cropper/cropper.css">
  <link rel="stylesheet" href="./css/add.css">
</head>
<body>
    
  内容区，还是卡片面板

  <script src="../assets/lib/layui/layui.all.js"></script>
  <script src="../assets/lib/jquery.js"></script>
  <script src="../assets/lib/template-web.js"></script>
  <!-- 加载富文本编辑器插件，按照顺序加载 -->
  <script src="../assets/lib/tinymce/tinymce.min.js"></script>
  <script src="../assets/lib/tinymce/tinymce_setup.js"></script>
  <!-- 按照顺序，加载剪裁插件的js -->
  <script src="../assets/lib/cropper/Cropper.js"></script>
  <script src="../assets/lib/cropper/jquery-cropper.js"></script>

  <script src="../assets/js/common.js"></script>
  <script src="./js/add.js"></script>
</body>
</html>
```



### 页面布局

- 使用卡片面板

- **卡片的**body区放表单

- 表单的内容区（content）

    - 去 layui --> 文档 --> 表单 --> 小睹为快 复制 多行文本域。
    - 在自己的js中，调用一个 `initEditor()` 函数，该函数会把 textarea替换成富文本框

- 表单的图片裁剪区（cover_img），添加如下的表单行

    ```html
    <div class="layui-form-item">
      <!-- 左侧的 label -->
      <label class="layui-form-label">文章封面</label>
      <!-- 选择封面区域 -->
      <div class="layui-input-block cover-box">
        <!-- 左侧裁剪区域 -->
        <div class="cover-left">
          <img id="image" src="/assets/images/sample2.jpg" alt="" />
        </div>
        <!-- 右侧预览区域和选择封面区域 -->
        <div class="cover-right">
          <!-- 预览的区域 -->
          <div class="img-preview"></div>
          <!-- 选择封面按钮 -->
          <button type="button" class="layui-btn layui-btn-danger">选择封面</button>
        </div>
      </div>
    </div>
    ```

    CSS样式

    ```css
    /* 封面容器的样式 */
    .cover-box {
      display: flex;
    }
    
    /* 左侧裁剪区域的样式 */
    .cover-left {
      width: 400px;
      height: 280px;
      overflow: hidden;
      margin-right: 20px;
    }
    
    /* 右侧盒子的样式 */
    .cover-right {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    /* 预览区域的样式 */
    .img-preview {
      width: 200px;
      height: 140px;
      background-color: #ccc;
      margin-bottom: 20px;
      overflow: hidden;
    }
    ```

    JS，实现基本的剪裁框

    ```js
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
      aspectRatio: 400 / 280,
      preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)
    ```

- 按钮区

    - 使用一个提交按钮

完整的HTML结构：

```html
<div class="layui-card">
	<div class="layui-card-header">发布文章</div>
	<div class="layui-card-body">
		<form class="layui-form" action="">
			<!-- 第一项：标题 -->
			<div class="layui-form-item">
				<label class="layui-form-label">文章标题</label>
				<div class="layui-input-block">
					<input type="text" name="title" required lay-verify="required" placeholder="请输入标题" autocomplete="off"
						class="layui-input">
				</div>
			</div>
			<!-- 第二项：选择分类 -->
			<div class="layui-form-item">
				<label class="layui-form-label">文章分类</label>
				<div class="layui-input-block">
					<select name="cate_id" lay-verify="required">
						<option value=""></option>
						<option value="0">北京</option>
						<option value="1">上海</option>
						<option value="2">广州</option>
						<option value="3">深圳</option>
						<option value="4">杭州</option>
					</select>
				</div>
			</div>
			<!-- 第三项：文章内容 -->
			<div class="layui-form-item layui-form-text">
				<label class="layui-form-label">文章内容</label>
				<div class="layui-input-block">
					<textarea name="content" placeholder="请输入内容" class="layui-textarea"></textarea>
				</div>
			</div>
			<!-- 第四项：封面图片 -->
			<div class="layui-form-item">
				<!-- 左侧的 label -->
				<label class="layui-form-label">文章封面</label>
				<!-- 选择封面区域 -->
				<div class="layui-input-block cover-box">
					<!-- 左侧裁剪区域 -->
					<div class="cover-left">
						<img id="image" src="/assets/images/sample2.jpg" alt="" />
					</div>
					<!-- 右侧预览区域和选择封面区域 -->
					<div class="cover-right">
						<!-- 预览的区域 -->
						<div class="img-preview"></div>
						<!-- 选择封面按钮 -->
						<button type="button" class="layui-btn layui-btn-danger">选择封面</button>
					</div>
				</div>
			</div>
			<!-- 第五项：选择状态 -->
			<div class="layui-form-item">
				<label class="layui-form-label">文章状态</label>
				<div class="layui-input-block">
					<input type="radio" name="state" value="已发布" title="发布">
					<input type="radio" name="state" value="草稿" title="存为草稿" checked>
				</div>
			</div>
			<!-- 第六项：按钮 -->
			<div class="layui-form-item">
				<div class="layui-input-block">
					<button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
				</div>
			</div>
		</form>
	</div>
</div>
```



### 获取分类渲染到下拉列表

- 获取所有的分类，渲染到下拉框
    - ajax请求之后，获取到分类
    - 使用模板引擎渲染select框
    - 动态添加select框之后，发现页面中的下拉框看不见了，**需要使用 form.render() 方法更新渲染**。

```js
// ------------------  获取分类，渲染到下拉框中 -------------
$.ajax({
    url: '/my/category/list',
    success: function (res) {
        var str = template('tpl-category', res);
        $('select').html(str);
        // 模板引擎处理完之后，重新渲染select
        form.render('select');
    }
});
```

HTML模板：

```html
<script type="text/html" id="tpl-category">
  <option value="">请选择文章类别</option>
  {{each data item}}
  <option value="{{item.id}}">{{item.name}}</option>
  {{/each}}
</script>
```



### 处理封面区

> 你可以复制之前的代码。

```js
// -------------------------- 处理封面图片 -----------------
// 1. 初始化剪裁框
// 1.1) 初始化图片裁剪器
var $image = $('#image')
// 1.2) 裁剪选项
var options = {
  aspectRatio: 400 / 280,
  preview: '.img-preview'
}
// 1.3) 初始化裁剪区域
$image.cropper(options);


// 2. 点击 “选择封面” 能够选择图片
$('button:contains("选择封面")').click(function () {
  $('#file').trigger('click');
});

// 3. 图片切换的时候，更换剪裁区的图片
$('#file').change(function () {
  // 3.1) 找到文件对象
  var fileObj = this.files[0];
  // 3.2) 创建url
  var url = URL.createObjectURL(fileObj);
  // 3.3) 更换图片
  $image.cropper('destroy').attr('src', url).cropper(options);
});
```

### 实现最终的发布

- 把表单中，每个表单元素的name检查一下，因为FormData是根据name获取值的
- 注册表单提交事件
    - 收集表单各项数据 （FormData只收集到了 title/state/cate_id 这三个值）
    - content需要通过插件 tinymce 的特有方式来获取，获取之后，更改fd中的content值
        - tinyMCE.activeEditor.getContent()  使用这行代码获取文章内容
        - 使用 fd.set('content',  tinyMCE.activeEditor.getContent());
    - 完成图片裁剪，转换成blob格式，并将得到的图片追加到FormData中

```js
// ---------------------  完成最终的添加文章 ----------------------
$('#add-form').on('submit', function (e) {
  e.preventDefault();
  // 收集表单数据(必须是FormData)
  var fd = new FormData(this);
  // fd对象中，有content，但是值为空； 根本就没有 图片
  // 1. 获取富文本编辑器里面的内容，并不是追加到fd中，而是更改fd里面的内容
  fd.set('content', tinyMCE.activeEditor.getContent());

  // 2. 剪裁图片，转成 blob 形参（二进制形式或文件对象形式），追加到fd中
  var canvas = $image.cropper('getCroppedCanvas', {
    width: 400,
    height: 280
  });

  // 把canvas图片转成二进制形式
  canvas.toBlob(function (blob) {
    // 追加文件对象到fd中
    fd.append('cover_img', blob);

    // 检查一下，fd对象中，是否取得了接口要求的所有参赛
    // fd.forEach((val, key) => {
    //     console.log(key, val);
    // });
    // return;
    // 发送ajax请求，完成最终的添加
    $.ajax({
      type: 'POST',
      url: '/my/article/add',
      data: fd,
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          // 添加成功，跳转到 文章列表 页面
          location.href = '/article/article.html'
        }
      },
      processData: false, // 不要处理数据；意思是不要把对象形式的fd转换成查询字符串形式
      contentType: false // 不要加默认的请求头（application/x-www-form-urlencoded），让浏览器自行设置请求头
    });
  });
})
```



## 编辑文章

### 思路

- 复制添加文章页为编辑页面（edit.html），css和js同样复制一份，并修改css和js链接。
- 编辑页面，打开之后，需要做数据回填。

- 后续实现，和添加基本一样。

### 实现

- 复制 add.html 为 edit.html (编辑页面)、css和js自行复制，别忘记修改css和js链接。

- 文章列表页面（list.html），给 ”编辑“ 挂超链接，链接到 edit.html ，并且**传递 id 参数**

    ```html
    <a href="./edit.html?id={{val.id}}" class="layui-btn layui-btn-xs">编辑</a>
    ```

    > **vscode中千万不要直接打开edit.html ，否则获取不到文章id；**
    >
    > **应该先打开文章列表页面，通过点击编辑按钮跳转到edit.html才是正确的。**

- edit.js 中 获取地址栏的id，根据id查询一篇文章详情，然后完成表单数据渲染

    ```js
// 获取地址栏的id，这个id是文章的id；
    var id = new URLSearchParams(location.search).get('id');
    // console.log(id);
    
    ```
    
- 在**下拉框的分类渲染成功后**，完成数据回填

    ```js
    
    // -------------------------- 获取分类，渲染到下拉框的位置 --------
    $.ajax({
      url: '/my/article/list',
      success: function (res) {
        var html = template('tpl-category', res);
        $('select[name=cate_id]').html(html);
        form.render('select');
        // 下拉框的分类渲染完成，然后再去发送ajax请求，获取文章详情
        // 根据id可以获取文章详情（标题、内容、状态、图片.....）全部获取到
        $.ajax({
          // url: '/my/article/:id', // 把 :id 换成真实的id即可
          url: '/my/article/' + id,
          success: function (res) {
            // console.log(res);
            // 获取到详情后，做数据回填 (使用layui提供的 form.val())
            form.val('article', res.data);
            // 一定先做数据回填，然后在把 textarea 换成 富文本编辑器
            initEditor();
            // 更换图片(销毁剪裁区 --> 更换图片 --> 重建剪裁区)
            $image
              .cropper('destroy')
              .attr('src', baseUrl + '/' + res.data.cover_img)
              .cropper(options);
          }
        });
      }
    });
    ```

- edit.js中，图片剪裁默认**铺满整个区域**

    ```js
    var options = {
            // 宽高比
            aspectRatio: 400 / 280,
            autoCropArea: 1, // 让剪裁框铺满整个剪裁区
            // 设置预览区的选择器
            preview: '.img-preview'
        };
    ```

- 添加Id

    ```js
    // 追加Id
    data.append('id', id);
    ```

- 修改添加文章的`接口`为更新文章的`接口`即可，其他都不需要修改。

## 分页

- 文章列表页，加载layui的laypage模块
- 编写渲染分页的函数 （showPage）
- 渲染完文章列表之后，马上渲染分页（在renderArticle函数里面，ajax请求成功后，调用`showPage(res.total)`）
- showPage函数
    - 根据官方文档，生成分页效果
    - jump事件中，修改请求参数中的pagenum和pagesize，并重新渲染列表

```js
/****          加载layui的laypage模块       *******/
var laypage = layui.laypage;


/****          全局设置请求参数       *******/
var data = {
    pagenum: 1, // 页码值
    pagesize: 2, // 每页显示多少条
    // cate_id: ,
    // state: ,
};



/****          定义renderArticle函数，获取文章列表数据；成功后调用createPage() 函数 ******/
function renderArticle() {
    $.ajax({
        url: '/my/article/list',
        data: data,
        success: function (res) {
            console.log(res);
            // res.total // 总数
            // 通过模板引擎，渲染
            let str = template('list', res);
            $('tbody').html(str);
            // 当ajax请求成功之后，获取到总数之后，调用显示分页的函数
            showPage(res.total);
        }
    });
}

/*********    定义showPage函数   **********/
// 实现分页
function showPage (t) {
    laypage.render({
        elem: 'page', // 不要加 #
        count: t, // 表示总计有多少条数据
        limit: data.pagesize, // 每页显示多少条
        limits: [2, 3, 4, 5],
        curr: data.pagenum, //  起始页（控制页码的背景色，表示是选中状态）
        // prev: '上一个'
        layout: ['limit', 'prev', 'page', 'next', 'count', 'skip'],
        // 点击页码的时候，会触发下面的jump函数。页面刷新之后，也会触发一次
        jump: function (obj, first) {
            // console.log(obj); // 表示前面控制分页的所有属性
            // console.log(first); // 刷新页面之后，是tru，再点击页码，它就是undefined了
            // 点击页码的时候，jump函数会触发，此时，改变data.pagesize和data.pagenum，调用renderArticle即可看对对应页的数据
            if (!first) {
                // console.log(obj.curr);
                data.pagenum = obj.curr;
                data.pagesize = obj.limit;
                renderArticle();
            }        
        }
    });
}
```

> 实现分页，就是修改请求参数（pagenum和pagesize），然后重新发送ajax请求，重新渲染页面。

## 筛选

### 处理搜索区的两个下拉框

- 分类的获取

    ```js
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
    ```

    ```html
    <!-- 分类下拉框留空 -->
    <select id="category" lay-verify="">
        
    </select>
    ```

    ```html
    <!-- 分类的模板 -->
    <script type="text/html" id="tpl-category">
      <option value="">请选择一个分类</option>
      {{each data item}}
      <option value="{{item.id}}">{{item.name}}</option>
      {{/each}}
    </script>
    ```

    

- 状态自行处理即可

    ```html
    <select id="state" lay-verify="">
        <option value="">所有状态</option>
        <option value="已发布">已发布</option>
        <option value="草稿">草稿</option>
    </select>
    ```

### 完成搜索功能

- 思路
    - 根据搜索条件，改变请求参数即可。
- 监听搜索区的表单(自己加id=search)的提交事件
    - 获取下拉框的值，根据下拉框的id获取值
    - 修改获取文章列表的请求参数
    - 重置页码为1
    - 重新渲染文章列表

```js
// 2. 完成筛选
$('#search').on('submit', function (e) {
  e.preventDefault();
  // 获取两个下拉框的值
  var cate_id = $('#category').val();
  var state = $('#state').val();
  // 设置ajax请求的参数
  if (cate_id) {
    data.cate_id = cate_id;
  } else {
    delete data.cate_id; // delete 用于删除对象的属性
  }

  if (state) {
    data.state = state;
  } else {
    delete data.state;
  }

  // 重置页码为 1
  data.pagenum = 1;

  renderArticle(); // 调用renderArticle();渲染页面即可

})
```

## 页面跳转问题

当token过期了，需要跳转到登录页重新登录。

但是，从 index.html 跳转到 login.html ，路径是 `./login.html`

从其他小页面跳转到 login.html ，路径是 `../login.html`，而且应该让父页面跳转。

所以，当ajax请求完成后，判断如果是身份认证失败了。继续判断是哪个页面。

```js
option.complete = function (xhr) {
  var res = xhr.responseJSON;
  if (res && res.status === 1 && res.message === '身份认证失败！') {
    // 清除掉过期的token
    localStorage.removeItem('token');
    // 跳转到登录页 (location.pathname 表示url的路径部分)
    if (location.pathname === '/index.html') {
      location.href = './login.html';
    } else {
      window.parent.location.href = '../login.html';
    }
  }
  // 其他错误
  if (res && res.status === 1) {
    layer.msg(res.message);
  }
}
```

