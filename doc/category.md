## 类别页面布局

### 准备工作

- 创建所需的js文件、css文件
  - ./article/category.html
  - ./article/css/category.css
  - ./article/js/category.js
- index.html 侧边栏挂好超链接
- category.html 中，加载所需的js文件和css文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./assets/lib/layui/css/layui.css">
    <link rel="stylesheet" href="./css/category.css">
</head>
<body>
    

    <script src="./assets/lib/jquery.js"></script>
    <script src="./assets/lib/template-web.js"></script>
    <!-- 必须加载layui.all.js，因为页面中用到了很多layui提供的功能，比如弹层 -->
    <script src="./assets/lib/layui/layui.all.js"></script>
    <!-- 加载自己的js文件 -->
    <script src="./js/category.js"></script>
</body>
</html>
```

### 页面布局

- layui文档 --> 页面元素（侧边栏） --> 面板 --> 卡片面板  -->  复制代码，实现卡片布局
- 自己写css，设置body的背景色（#f1f2f5），内填充（padding: 20px）
- 标题区
    - 有一行文字
    
    - 一个按钮（layui文档-->页面元素-->按钮-->复制代码）
    
    - 自己写css，调整标题区里的元素两端对齐
    
        ```css
        .layui-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        ```
- 内容区
    - 复制一个表格（layui文档-->页面元素-->表格-->复制代码）
    - 调整列的宽度
    - 最后一列中，放编辑和删除两个按钮

完整的HTML结构：

```html
<div class="layui-card">
  <div class="layui-card-header">
    <!-- 标题区 -->
    文章类别管理
    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">添加类别</button>
  </div>
  <div class="layui-card-body">
    <!-- 内容区 -->
    <table class="layui-table">
      <colgroup>
        <col width="40%">
        <col width="40%">
        <col>  <!-- 剩余的20% 就是第三列的宽度 -->
      </colgroup>
      <thead>
        <tr>
          <th>类别名称</th>
          <th>类别别名</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>

        <tr>
          <td>贤心</td>
          <td>2016-11-29</td>
          <td>
            <button type="button" class="layui-btn layui-btn-xs">编辑</button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-danger">删除</button>
          </td>
        </tr>

      </tbody>
    </table>

  </div>
</div>
```

完整的css代码：

```css
body {
    background-color: #f2f3f5;
    padding: 20px;
}

/* 设置标题区 */
.layui-card-header {
    display: flex;
    align-items: center; /*上下居中对齐*/
    justify-content: space-between; /*左右两端对齐*/
}
```

## 获取类别列表

### ajax请求，获取分类列表数据

- 在category.js中，封装renderCategory函数，里面发送ajax请求获取类别列表数据

```js
// ----------------------------- 获取分类，渲染到页面中 ---------------------------
// 直接封装成函数，目的是，添加完成、删除完成、修改完之后，还要调用这个函数来重新渲染页面
// render -- 渲染
// category -- 类别
// ------------------------  获取类别列表，渲染到页面中 -----------------------
function renderCategory () {
    $.ajax({
        url: '/my/category/list',
        success: function (res) {
            // console.log(res);
            if (res.status === 0) {
                // 把数据 通过模板引擎 渲染到页面中
                var html = template('tpl-list', res);
                // 把html放到tbody中
                $('tbody').html(html);
            }
        }
    });
}
// 别忘记调用函数哟~~~
renderCategory();
```

### 通过模板引擎渲染数据

HTML模板：

```html
<!-- 类别列表模板 start -->
<script type="text/html" id="tpl-list">
    {{each data item}}
    <tr>
        <td>{{item.name}}</td>
        <td>{{item.alias}}</td>
        <td>
            <button type="button" class="layui-btn layui-btn-xs">编辑</button>
            <button type="button" class="layui-btn layui-btn-xs layui-btn-danger">删除</button>
        </td>
    </tr>
    {{/each}}
</script>
<!-- 类别列表模板 end -->
```



## 删除类别

### 注册事件并获取分类id

- 遍历数据的时候，给删除按钮加自定义属性 `data-id` ，值是 `{{item.id}}`。
- 必须使用事件委托的方式，给删除注册单击事件。

代码略。

### 使用弹出层

- 文档位置：
    - layui文档 --> 内置模块（侧边栏） --> 弹出层 --> 目录（右侧）--> 内置方法 --> 询问框
- 可以使用在线调试测试弹层的代码

> 进入到弹出层页面之后，有一个独立版本的链接，通过这个链接，可以看到所有的弹层效果。

### 发送Ajax请求，完成删除

```js
// ------------------------  删除分类 -----------------------
$('tbody').on('click', 'button:contains("删除")', function () {
    // 获取id
    var id = $(this).data('id');

    // 询问是否要删除
    layer.confirm('你是否要删除吗？', function (index) {
        // do something

        // 点击确定，这个函数触发了
        // console.log(id);
        // 发送ajax请求进行删除操作
        $.ajax({
            url: '/my/category/delete',
            data: { id: id },
            success: function (res) {
                // console.log(res);
                // 无论删除成功，还是失败，都给出提示
                layer.msg(res.message);
                // 删除成功，重新渲染页面
                if (res.status === 0) {
                    renderCategory();
                }
            }
        });
		// 关闭弹层
        layer.close(index);
    });
});
```

## 添加类别

### 点击按钮，实现弹层

- 注册按钮的单击事件

- 显示弹层

    ```js
    // 声明一个变量，让它表示弹层；后面关闭弹层时会用到它。
    var addIndex;
    // 一、点击添加分类，实现弹层
    $('button:contains("添加类别")').click(function () {
        addIndex = layer.open({
            type: 1,
            title: '添加类别',
            content: $('#tpl-add').html(), // 内容在HTML中
            area: ['500px', '250px']
        });
    });
    ```

- HTML中，制作添加的模板，**下面是一个演示效果**。

    ```html
    <!-- 添加的模板 start -->
    <script type="text/html" id="tpl-add">
        <form action="">
            类别名称：<input type="text"><br />
            类别名称：<input type="text"><br />
            <button>确认添加</button>
            <button>重置</button>
        </form>
    </script>
    <!-- 添加的模板 end -->
    ```

### 设置弹层的内容

- 具体查看layui官网，去复制表单的内容。
- 给 表单加一个类或者id，方便找到它。这里我加的是 `id="add-form"`
- 设置input的name属性值，值必须和接口要求的请求参数一致。

完整的模板：

```html
<!-- 添加的模板 start -->
<script type="text/html" id="tpl-add">
    <!-- 表单去layui官网复制 -->
<form class="layui-form" id="add-form" style="margin: 15px 30px 0 0">
    <!-- 第一项：类别名称 -->
    <div class="layui-form-item">
        <label class="layui-form-label">类别名称</label>
        <div class="layui-input-block">
            <input type="text" name="name" required lay-verify="required" placeholder="请输入类别名称" autocomplete="off"
                class="layui-input">
        </div>
    </div>
    <!-- 第二项：类别别名 -->
    <div class="layui-form-item">
        <label class="layui-form-label">类别别名</label>
        <div class="layui-input-block">
            <input type="text" name="alias" required lay-verify="required" placeholder="请输入类别别名" autocomplete="off"
                class="layui-input">
        </div>
    </div>
    <!-- 第三项：按钮（这个按钮去表单那复制） -->
    <div class="layui-form-item">
        <div class="layui-input-block">
            <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
        </div>
    </div>
</form>
</script>
<!-- 添加的模板 end -->
```

### 提交表单数据，完成添加

- 事件委托的方式，给添加的form注册submit事件
- 使用 serialize 获取输入框的值（`注意：需要修改input的name属性`）
- ajax提交数据，完成添加
- 添加成功，除了要渲染数据之外，还需要调用 `layer.close(addIndex)` 关闭弹层

```js
// 二、提交表单数据，完成添加
// 注册表单的submit事件
$('body').on('submit', '#add-form', function (e) {
    e.preventDefault();
    // 规律：如果没有图片上传，一般都不使用FormData。
    // 具体：还得看接口要求
    var data = $(this).serialize(); // 一定要检查input是否有正确的name属性
    // ajax提交数据，完成添加
    $.ajax({
        type: 'POST',
        url: '/my/category/add',
        data: data,
        success: function (res) {
            // 无论成功失败，都提示
            layer.msg(res.message);
            // 添加成功
            if (res.status === 0) {
                renderCategory();
                // 关闭弹层
                layer.close(addIndex);
            }
        }
    });
});
```



## 编辑类别

### 点击编辑按钮，实现弹出层

**复制添加的代码（html模板和js代码）即可。当然要稍作修改**

- 复制JS弹出层代码
    - 弹出层的索引 `editIndex`
    - 修改弹层的标题
    - 修改弹层的内容 `content: $('#tpl-edit').html()`
- 复制添加类别的模板
    - 修改模板的id为 `tpl-edit`
    - 修改表单form的id 把 `add-form` 改为 `edit-form`
    - 修改标题的文字和按钮文字
    - **添加隐藏域id** `<input type="hidden" name="id" />` ，老师添加到按钮前面了

> 修改分类的接口，要求提交分类id，所以在表单中隐藏一个id。后面通过 serialize() 能够获取隐藏域的值。

### 设置input的默认值

**☞ 重要**：所有的编辑操作，都会有类似的，为input设置value的操作。

**☞ 重要**：这一个步骤，也叫做**数据回填**，或者叫做**为表单赋值**。

**☞ 重要**：做法也不一定一样，只要能够把输入框的默认值设置好即可。

我们采用一个简单的办法，思路来源于删除操作，具体如下：

- 给编辑按钮添加三个自定义属性，分别存放当前分类的id、name、alias值
- 点击编辑按钮的时候，获取事件源的三个自定义属性值
- 当弹出层出现之后，找到input，设置他们的value值。

HTML的改变（设置编辑按钮的 data-xxx 属性值）：

```html
<button type="button" class="layui-btn layui-btn-xs edit" data-id="{{val.id}}" data-name="{{val.name}}" data-alias="{{val.alias}}">编辑</button>
```

JS代码：

```js
// ----------------------- 编辑 （点击 编辑，显示弹层） -----
$('body').on('click', 'button:contains("编辑")', function () {
    // 获取事件源上的 三个 data-xxx 属性值
    var shuju = $(this).data();
    // console.log(shuju); // { name: 'xx', alias: 'xx', id: 2 }
    // editIndex 表示当前的弹层；关闭弹层的时候，需要用到它
    editIndex = layer.open({
        type: 1,
        title: '编辑分类',
        content: $('#tpl-edit').html(),
        area: ['500px', '250px'],
        // 弹层弹出后的回调，不要和ajax中的success弄混了
        success: function () {
            // 数据回填(不要忘记id)
            $('#edit-form input[name="name"]').val(shuju.name);
            $('#edit-form input[name="alias"]').val(shuju.alias);
            $('#edit-form input[name="id"]').val(shuju.id);
        }
    });
});
```

### 提交表单，完成编辑

- 注册表单的submit事件
- 获取输入框的值
- ajax提交给接口

```js
// ----------------------- 编辑 （点击 确认修改，完成编辑） -----
$('body').on('submit', '#edit-form', function (e) {
    e.preventDefault();
    // 收集表单各项值
    var data = $(this).serializeArray();
    // ajax提交，完成修改
    $.ajax({
        type: 'POST',
        data: data,
        url: '/my/category/update',
        success: function (res) {
            // 无论成功，还是失败，都给出提示
            layer.msg(res.message);
            if (res.status === 0) {
                renderCategory();
                layer.close(editIndex);
            }
        }
    });
})
```

