class Problem {
  // 实例化类自动调用
  constructor() {
    // 获取保存按钮,绑定点击事件
    this.$('.save-data').addEventListener('click', this.saveData);
    // 给tbody绑定点击事件,利用事件委托,将所有的子元素点击事件,都委托给它
    // 节点事件的回调方法的this指向当前节点对象
    // bind()  返回一个新的函数引用,改变其内部this指向
    this.$('.table tbody').addEventListener('click', this.distribute.bind(this))
    this.getData();

    // 给模态框的确认删除按钮绑定事件
    this.$('.confirm-del').addEventListener('click', this.confirmDel.bind(this));

    // 给修改的保存按钮,绑定事件
    this.$('.modify-data').addEventListener('click', this.saveModify.bind(this))
  }
  /******tbody点击的回调函数******/
  distribute(eve) {
    // console.log(eve);
    // 获取事件源
    let tar = eve.target;
    //  console.log(tar);
    // 判断按钮上是否有指定的类,确定当前点击的是什么按钮
    // 删除的button上 绑定的 btn-del
    // 修改的button上 绑定的 btn-modify
    // console.log(tar.classList.contains('btn-del'));
    // console.log(this);

    // 判断点击的是否为删除按钮,是则调用删除的方法
    if (tar.classList.contains('btn-del')) this.delData(tar);

    // 判断点击的是否为修改按钮,是则调用修改的方法
    if (tar.classList.contains('btn-modify')) this.modifyData(tar);

  }
  /*
   修改的方法
    1 弹出修改模态框
    2 将原有的数据,现在模态框中
    3 将修改数据的id,隐藏到修改模态框中
    4 获取表单中数据,不为空则发送给后台
    5 刷新页面
   */

  findTr(target) {
    // console.log(target);
    // 通过上一级找到,tr
    if (target.nodeName == 'TR') {
      return target;
    } else {
      return this.findTr(target.parentNode);
    }

  }

  modifyData(target) {
    // console.log(target);
    // 使用递归查找tr
    // let trObj = this.findTr(target);
    // return;
    // console.log(trObj);

    // 弹出修改的模态框
    $('#modifyModal').modal('show');
    // 获取要修改的数据,显示到模态框
    // 判断是span还是button,然后找到对应的tr
    let trObj = '';
    if (target.nodeName == 'SPAN') {
      trObj = target.parentNode.parentNode.parentNode;
    }

    if (target.nodeName == 'BUTTON') {
      trObj = target.parentNode.parentNode;
    }

    // console.log(trObj);
    // 获取所有的子节点, 分别取出 id idea title pos
    let chil = trObj.children;
    // console.log(chil);
    let id = chil[0].innerHTML;
    let title = chil[1].innerHTML;
    let pos = chil[2].innerHTML;
    let idea = chil[3].innerHTML;

    // console.log(id, title, pos, idea);
    // 将内容放到修改表单中
    let form = this.$('#modifyModal form').elements;
    // console.log(form);
    form.title.value = title;
    form.idea.value = idea;
    form.pos.value = pos;
    // 将id设置为属性
    this.modifyId = id;
  }
  saveModify() {
    // console.log(this.modifyId, 2222);
    // 收集表单中的数据
    //  let form = this.$('#modifyModal form').elements;
    // console.log(form);
    // let title = form.title.value.trim();
    // let idea = form.idea.value.trim();
    // let pos = form.pos.value.trim();

    // 解析构赋值
    let { title, pos, idea } = this.$('#modifyModal form').elements;
    // console.log(title, pos, idea);
    let titleVal = title.value.trim();
    let ideaVal = idea.value.trim();
    let posVal = pos.value.trim();
    // console.log(titleVal, ideaVal, posVal);
    // 进行非空验证
    // if (!posVal || !ideaVal || !titleVal) throw new Error('字段不能为空!')
    // 结束代码运行
    if (!posVal || !ideaVal || !titleVal) return;

    // 给后台发送数据,进行修改
    axios.put('http://localhost:3000/problem/' + this.modifyId, {
      title: titleVal,
      idea: ideaVal,
      pos: posVal
    }).then(res => {
      // console.log(res);
      // 请求成功则刷新页面
      if (res.status == 200) {
        location.reload();
      }

    })
  }



  /********删除的方法******/
  delData(target) {
    // console.log('我是删除...');
    // 将当前准备删除的节点保存到属性上
    this.target = target;
    // 1 弹出确认删除的模态框,通过js控制
    // $() 是jquery的方法,不是我们封装的那个,不要加this
    $('#delModal').modal('show')



  }

  confirmDel() {
    // console.log(this.target.nodeName);
    // 获取id
    let id = 0;
    // 确定点击的是span还是button
    if (this.target.nodeName == 'SPAN') {
      let trObj = this.target.parentNode.parentNode.parentNode;
      // console.log(trObj);
      id = trObj.firstElementChild.innerHTML


    }
    if (this.target.nodeName == 'BUTTON') {
      let trObj = this.target.parentNode.parentNode;
      // console.log(trObj);
      id = trObj.firstElementChild.innerHTML
    }

    // console.log(id);

    // 将id发送给json-server服务器,删除对应的数据,刷新页面
    axios.delete('http://localhost:3000/problem/' + id).then(res => {
      // console.log(res);
      // 判断状态为200 则删除成功
      if (res.status == 200) {
        // 刷新页面
        location.reload();
      }

    })

    // console.log('确认删除了...');


  }
  /********保存数据的方法*******/
  saveData() {
    // console.log(this, 111);
    // 1  获取添加表单
    let form = document.forms[0].elements;
    // console.log(form);
    // trim 去除空格
    let title = form.title.value.trim();
    let pos = form.pos.value.trim();
    let idea = form.idea.value.trim();
    // console.log(title, pos, idea);
    // 2 判断表单中每一项是否有值,如果为空,则提示
    if (!title || !pos || !idea) {
      throw new Error('表单不能为空');
    }
    // 3 将数据通过ajax,发送给json-server 服务器,进行保存
    // json-server 中,post请求,是添加数据的
    axios.post('http://localhost:3000/problem', {
      title,
      pos,
      idea
    }).then(res => {
      // console.log(res);
      // 如果添加成功则刷新页面
      if (res.status == 201) {
        location.reload();
      }
    })
  }

  /*******获取数据的方法******/
  getData() {
    // console.log('这是数据获取');
    // 获取tbody,页面中只有一个符合条件的,返回单个节点对象
    // let tbody = this.$('tbody');
    // console.log(tbody);
    // 页面中有多个div,返回节点集合
    // let div = this.$('div');
    // console.log(div);
    // 1 发送ajax请求,获取数据
    axios.get('http://localhost:3000/problem').then(res => {
      // console.log(data);
      // 2 获取返回值中的data和status
      //console.log(res);
      let { data, status } = res;
      // console.log(data, status);
      // 3 当状态为200 时,表示请求成功
      if (status == 200) {
        // console.log(data);
        // 4 将获取的数据,渲染到页面中 
        let html = '';
        data.forEach(ele => {
          // console.log(ele);
          /*
            1 删除的第一种思路,直接给行内绑定事件,但是回调方法要是静态的.
                   <button type="button" class="btn btn-danger btn-xs" onclick="Problem.delData()">
                    <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                   </button>

                // 静态方法是属于类的
                  static delData() {
                    console.log(1111);

                  }
            2 使用事件委托,将删除和修改操作的点击事件委托给 tbody
          */
          html += `<tr>
          <th scope="row">${ele.id}</th>
          <td>${ele.title}</td>
          <td>${ele.pos}</td>
          <td>${ele.idea}</td>
          <td>
    
          <button type="button" class="btn btn-danger btn-xs btn-del">
             <span class="glyphicon glyphicon-trash  btn-del" aria-hidden="true"></span>
          </button>
          <button type="button" class="btn btn-warning btn-xs btn-modify">
             <span class="glyphicon glyphicon-refresh  btn-modify" aria-hidden="true"></span>
          </button>
          </td>
        </tr>`;
        });
        // console.log(html);
        // 5 将拼接的tr追加到页面
        this.$('.table tbody').innerHTML = html;
      }

    })

  }



  /*******获取节点的方法******/
  $(ele) {
    let res = document.querySelectorAll(ele);
    // 判断当前页面只有一个符合条件的,就返回单个节点对象,否则返回节点集合
    return res.length == 1 ? res[0] : res;
  }
}

new Problem;