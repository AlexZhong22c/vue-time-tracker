vue-cli + vue2 + vue-router + axios + vuex2 + express + mongoose

一个简单的ToDoList——经典vue单页路由入门全家桶，我在大神们demo的基础上不断地改进。

原博文地址：[https://alexzhong22c.github.io/2017/04/25/vue-time-tracker/](https://alexzhong22c.github.io/2017/04/25/vue-time-tracker/)

- 使用vue-cli创建项目
- .vue文件组件化的开发
- 使用vue-router实现单页路由
- 使用axios请求我们的node服务端，即express
- 使用vuex管理我们的数据流
- express 和 MongoDB做后台和数据库，演示了前后台的数据交互，ajax请求
- 使用mongoose操作MongoDB

“计划列表”界面

![演示图1](http://olqa2s510.bkt.clouddn.com/time-tracker1.png)

创建任务：

![演示图2](http://olqa2s510.bkt.clouddn.com/time-tracker2.png)

## 运行demo:

用`npm install`之后，总共需要打开两个命令行窗口，一个命令行运行：

```
node app.js // 会在8888端口开启一个后台
```

另一个命令行运行：

```
npm run dev
```

### 历史版本的commit记录：

| commit名           | commit时间  | 版本内容                                     |
| ----------------- | --------- | ---------------------------------------- |
| finish-first-time | 2017/4/25 | vue-cli + vue2 + vue-router + vue-resource + vuex2 + express + MongoDB |
| use-mongoose      | 2017/4/26 | 使用mongoose，重写app.js文件，使其简单易懂             |
| use-axios         | 2017/5/2  | 使用axios代替原来的vue-resource                 |

## 懒人速查

### main.js文件

- `main.js`将会作为我们应用的入口文件而`App.vue`会作为我们应用的初始化组件


- `...App`这句代码等价于`render:h => h(App)`
- 使用axios代替原来的vue-resource做ajax请求

#### eslint-disable no-new

我们这个项目是用vue-cli帮助配置生成的，如果在生成时你选择了启用eslint检测语法，那么eslint默认是不允许你使用new的，如果eslint不通过会报错，你的项目因此就无法让webpack用浏览器调试。

解决办法有很多，正如它提示的一样：eslint-disable no-new，就是去项目的根目录找到.eslintrc.js配置文件，然后在rules字段里面添加`"no-new": 0`，取消对no-new规则的检查，就像是这样：

```
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    "no-new": 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
```

此后，当我们调试或者打包项目的时候就不会因为这个new语法报错。

如果你想要了解各个eslint配置的含义，强烈推荐去 [eslint中文官网](http://eslint.cn/) 在官网用搜索栏一搜就能查到含义。

另外，可以看到这个demo的eslint配置主要是在引入 *eslint-config-standard* 的基础上稍稍修改的，其他的配置如果你不想浪费时间在自定义上，你可以参考我的博文：https://alexzhong22c.github.io/2017/03/11/try-eslint/

### App.vue文件

- `main.js`将会作为我们应用的入口文件而`App.vue`会作为我们应用的初始化组件
- [`ready`已被废除](#`ready`被废除) ，见本项目的App.vue 或 [官网原文](https://cn.vuejs.org/v2/guide/migration.html#ready-替换)

### TimeEntries.vue文件

- [`$dispatch`已被废除](#`$dispatch`被废除) ，本demo使用的就是vuex，见本项目TimeEntries.vue文件和src/store下的各个文件夹或 [官网原文](https://cn.vuejs.org/v2/guide/migration.html#dispatch-和-broadcast-替换)

总结：**在vue2.0中废除了使用事件的方式进行通信，所以在小项目中我们可以使用Event Bus，其余最好都使用vuex，本demo我们使用Vuex来实现数据通信**。

```
// this.$dispatch('deletePlan', timeEntry)，事件*通信*的写法
// $dispatch是vue1.x的写法，现已被废除，改为vuex来*通信*：
this.$store.dispatch('deletePlan', timeEntry)，用vuex*通信*
```

### LogTime.vue文件

- 组件可以没有“name"，如果给组件一个name可以方便在调试的时候在控制台打印错误是来自哪个组件的
- 对 [axios](#axios在vue中如何使用) 的用法做了粗浅介绍

### app.js文件

> demo经过了版本更新，原本使用MongoClient，现在用mongoose改写了一次

#### mpromise (mongoose's default promise library) is deprecated

http://blog.csdn.net/fd214333890/article/details/53486862

增加一句： `mongoose.Promise = global.Promise` 即可

#### mongoose是怎么找collections的?

https://cnodejs.org/topic/4f71363f8a04d82a3d1e4aea

```
mongoose.model('User', UserSchema);
```

去命令行：

```
use node_club show collections //只能看到有一个名为users的collection，而没有User的collection
```

由此我们可以推断mongoose在内部创建collection时将我们传递的collection名小写化，同时如果小写化的名称后面没有字母——s,则会在其后面添加一s,针对我们刚建的collection,则会命名为：users。

**可以通过下面两种方式更改collection的名字：**

```
1.xxschema = new Schema({
…
}, {collection: “your collection name”});

2.mongoose.model(‘User’, UserSchema, “your collection name”);
```

## 深入理解数据的请求

### 生命周期和数据请求的时机

vue实例的生命周期看这一篇：http://blog.csdn.net/sexy_squirrel/article/details/60764504

同样是向后台请求数据，App.vue是在mounted的时机，而TimeEntries是在created的时机。

那主要是因为我们需要先挂载好App组件，然后再请求数据。

而TimeEntries要等到请求完数据之后才会挂载上去，所以我们为TimeEntries做了一个loading提示，代表正在请求数据。

### 导航钩子和数据请求的时机

强烈推荐看这一篇：https://github.com/vuefe/vuefe.github.io/blob/1f6e110db81a0a385955ce4ec998f23e7190d2a9/src/router/advanced/data-fetching.md

### vuex和数据请求

谈一谈下面这一段被注释的代码：

```
    watch: {
      如果路由有变化，会再次执行该方法，进入和离开都会触发
      由于我们用了vuex--让timeEntries作为计算属性就能拿到数据，不必fetchData
      '$route': 'fetchData'
    },
```

- 我们经常拿计算属性和watch做对比
- 一般vue组件从vuex的state拿到数据的方式有二：
  - 一个是计算属性
  - 一个是封装getter函数再调用getter(适用于多个组件都需要相同的state数据的情况)
- vuex其实相当于一个前台的小数据库
- 使用vuex的一大特点就是：有vuex帮忙管理数据，**应用一开始从后台拿大量的数据也不会混乱**，之后用户每次增删改查一小部分数据的时候，先ajax让后台数据库实现增删改查，成功之后直接通过vuex的actions-->mutations-->state来增删改查state那里的数据就行了。
  - 因为ajax比较容易失败，所以一般都是ajax成功之后，再在回调函数中同步对应的前台state数据
- **尤其是“查”，页面切换回来或者路由切换回来的时候，需要重复再查一次此页的数据。** 使用vuex后，查数据不必去用ajax访问数据库，直接从state查数据就行了

结论：使用vuex后，原本这次需要调用fetchData函数去再查数据库，而现在直接用计算属性从state那里查就行了。

---

>2017/5/2更新：使用axios代替原来的vue-resource：

### axios在vue中如何使用

安装其他插件的时候，可以直接在 main.js 中引入并 Vue.use()，但是 axios 并不能 use，只能在每个需要发送请求的组件中即时引入。

为了解决这个问题，有两种开发思路，一是在引入 axios 之后，修改原型链，（另一种是在vuex的actions内封装一下，由于考虑到某些小伙伴不使用vuex，我们选用第一种方法）。

> 对这方面好奇的同学可以参考：http://blog.csdn.net/fen747042796/article/details/70660419?locationNum=6&fps=1

在 main.js 中引入 axios：

```
import axios from 'axios'
Vue.prototype.$ajax = axios
// 在 main.js 中添加了这两行代码之后，就能直接在组件的 methods 中使用 $ajax 命令
```

http://www.cnblogs.com/wisewrong/p/6402183.html

#### 回调函数的this

当请求成功时，会执行 .then，否则执行 .catch

这两个回调函数都有各自独立的作用域，**如果直接在里面访问 this，将会无法访问到 Vue 实例**，所以我们改为用箭头函数，详见demo中LogTime.vue文件的注释说明。

https://segmentfault.com/q/1010000005932552

http://blog.csdn.net/qtwwyl/article/details/70094361?utm_source=itdadao&utm_medium=referral

## 深入理解vuex

### state的数据在内存中

vuex的本质作用是管理组件之间复杂的状态的（如购物车逻辑等等...）,所以当F5刷新浏览器时，这些状态也会一并被清空。

如果想在F5之后不要丢失数据，一般都会采用cookie或者localStorage等方法存储：

https://segmentfault.com/q/1010000007336361

https://www.zhihu.com/question/54164220/answer/138185671

### 既然vuex2 可以直接去store拿state, 那getters还有什么用啊?

getters可以看做是store的计算属性。另外，我们最好遵循vuex的通讯流程：

#### vuex单向数据流

Vuex实际上是类[Flux](https://link.juejin.im/?target=https%3A%2F%2Ffacebook.github.io%2Fflux%2F)的数据管理架构。下面这张图很好的诠释了Vuex和组件之间的通讯关系。

![Vuex和组件之间的通讯关系](http://olqa2s510.bkt.clouddn.com/vuex.png)

这个图告诉我们不应该直接在vue Components去操作state中的数据，而是应该按照vue Components-->actions-->mutations-->state这个过程来操作数据。

> 组件永远都不应该直接改变 Vuex store 的状态。因为我们想要让状态的每次改变都很明确且可追踪，Vuex 状态的所有改变都必须在 store 的 mutation handler (变更句柄)中管理。

### 区分 actions 和 mutations

更改 Vuex 的 store 中的**状态**的唯一方法是提交 mutation。Vuex 中的 mutations 非常类似于事件：每个 mutation 都有一个字符串的 **事件类型 (type)** 和 一个 **回调函数 (handler)**。这个回调函数就是我们实际进行**状态**更改的地方，并且它会接受 state 作为第一个参数。

#### mutation 必须是同步函数，什么意思?

一条重要的原则就是要记住mutation 必须是**同步函数**，即**不准在mutations中编写异步回调的操作。**

```
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      // 这句话在异步函数的回调函数中 
      state.count++
    })
  }
}
```

现在想象，我们正在 debug 一个 app 并且观察 devtool 中的 mutation 日志。每一条 mutation 被记录，devtools 都需要捕捉到前一状态和后一状态的快照。

然而，在上面的例子中 mutation 中的**异步函数中的回调**让这不可能完成：(当 mutation 触发的时候，回调函数还没有被调用)，devtools 不知道什么时候**回调函数实际上被调用** —— 实质上任何在回调函数中进行的的状态的改变都是不可追踪记录的。

##### 从另一个角度去理解：

`Store`理解为一个仓库，`action`是一次操作，`mutation`是让仓库中存储的东西产生某种变化的方式，`state`则是存储的东西当前的状态。

一个操作可能需要对数据产生变动，另一个操作也需要对数据产生同样的变动，那这个变动可以抽取出来，称为一个`mutation`，这样，通过`commit`触发指定`的mutation`就可以了, 不必使其与操作业务的代码混在一起，导致代码混乱、可维护性差的结果。

##### 作者在知乎上的解释：

区分 actions 和 mutations 并不是为了解决竞态问题，而是为了能用 devtools 追踪记录状态的变化。

事实上在 vuex 里面 actions 只是一个架构性的概念，并不是必须的，说到底只是一个函数，你在里面想干嘛都可以，只要最后触发 mutation 就行。异步竞态怎么处理那是用户自己的事情。vuex 真正限制你的只有 mutation 必须是同步的这一点。[在 redux 里面就好像 reducer 必须同步返回(而不能异步返回)下一个状态一样。]

同步的意义在于这样每一个 mutation 执行完成后都可以对应到一个新的状态（和 reducer 一样），这样 devtools 就可以打个 snapshot 存下来，然后就可以随便 time-travel 了。	

如果你开着 devtool 调用一个异步的 action，你可以清楚地看到它所调用的 mutation 是何时被记录下来的，并且可以立刻查看它们对应的状态。其实尤雨溪有个点子一直没时间做，那就是把记录下来的 mutations 做成类似 rx-marble 那样的时间线图，对于理解应用的异步状态变化很有帮助。

作者：尤雨溪链接：https://www.zhihu.com/question/48759748/answer/112823337

### Mutations 需遵守 Vue 的响应规则

1\. 最好提前在你的 store 中初始化好所有所需属性。

2\. 当需要在对象上添加**新属性**时，你应该

- 使用 `Vue.set(obj, 'newProp', 123)`, 或者 -
- 以新对象替换老对象。例如，利用 stage-3 的[对象展开运算符](https://github.com/sebmarkbage/ecmascript-rest-spread)我们可以这样写：

```
  state.obj = { ...state.obj, newProp: 123 }
```

(这个demo并没有为对象添加新属性的操作，这里只是提醒一下有这个知识点)

## vue2 新旧替换

### `ready`被废除

使用新的 `mounted` 钩子函数替代。应该注意的是，使用 `mounted` 并不能保证钩子函数中的 `this.$el` 在 document 中。为此还应该引入 `Vue.nextTick`/`vm.$nextTick`。例如：

```vue
mounted: function () {
  this.$nextTick(function () {
    // 使用$nextTick，代码保证 this.$el 在 document 中
  })
}
```

见本项目的App.vue 或 [官网原文](https://cn.vuejs.org/v2/guide/migration.html#ready-替换)

### `$dispatch`被废除

总结：**在vue2.0中废除了使用事件的方式进行通信，所以在小项目中我们可以使用Event Bus，其余最好都使用vuex，本demo我们使用Vuex来实现数据通信**。

```
// this.$dispatch('deletePlan', timeEntry)，事件*通信*的写法
// $dispatch是vue1.x的写法，现已被废除，改为vuex来*通信*：
this.$store.dispatch('deletePlan', timeEntry)，用vuex*通信*
```

`$dispatch` 和 `$broadcast` 已经被弃用。因为基于组件树结构的事件流方式实在是让人难以理解，并且在组件结构扩展的过程中会变得越来越脆弱。这种事件方式确实不太好。

对于`$dispatch` 和 `$broadcast`最简单的升级方式就是：通过使用事件中心，允许组件自由交流，无论组件处于组件树的哪一层。由于 Vue 实例实现了一个事件分发接口，你可以通过实例化一个空的 Vue 实例来实现这个目的。

> 这些方法的最常见用途之一是父子组件的相互通信。在这些情况下，你可以使用 [`v-on`监听子组件上 $emit 的变化](https://cn.vuejs.org/v2/guide/components.html#Form-Input-Components-using-Custom-Events)。这可以允许你很方便的添加事件显性。
>
> 然而，如果是跨多层父子组件通信的话， `$emit` 并没有什么用。相反，用集中式的事件中间件可以做到简单的升级。（这会让组件之间的通信非常顺利，即使是兄弟组件。）

#### 单独的事件中心

比如，假设我们有个 todo 的应用结构如下：

```
Todos
|-- NewTodoInput
|-- Todo
    |-- DeleteTodoButton
```

可以通过单独的事件中心管理组件间的通信：

```
// 将在各处使用该事件中心
// 组件通过它来通信
var eventHub = new Vue()
```

然后在组件中，可以使用 `$emit`, `$on`, `$off` 分别来分发、监听、取消监听事件：

```
// NewTodoInput
// ...
methods: {
  addTodo: function () {
    eventHub.$emit('add-todo', { text: this.newTodoText })
    this.newTodoText = ''
  }
}
// --------------------------------------------
// DeleteTodoButton
// ...
methods: {
  deleteTodo: function (id) {
    eventHub.$emit('delete-todo', id)
  }
}
// --------------------------------------------
// Todos
// ...
created: function () {
  eventHub.$on('add-todo', this.addTodo)
  eventHub.$on('delete-todo', this.deleteTodo)
},
// 最好在组件销毁前
// 清除事件监听
beforeDestroy: function () {
  eventHub.$off('add-todo', this.addTodo)
  eventHub.$off('delete-todo', this.deleteTodo)
},
methods: {
  addTodo: function (newTodo) {
    this.todos.push(newTodo)
  },
  deleteTodo: function (todoId) {
    this.todos = this.todos.filter(function (todo) {
      return todo.id !== todoId
    })
  }
}
```

在简单的情况下可以这样用事件中心替代 `$dispatch` 和 `$broadcast`，但是对于大多数复杂情况，更推荐使用一个专用的状态管理层如：[Vuex](https://github.com/vuejs/vuex) ，Vuex意味着更多简明清晰的组件间通信和更好的状态管理方案。

##### vuex

本demo使用的就是vuex，见本项目TimeEntries.vue文件和src/store下的各个文件夹或 [官网原文](https://cn.vuejs.org/v2/guide/migration.html#dispatch-和-broadcast-替换)

## 最后还有小尾巴：

- 后台的代码主要在app.js文件里，已经解决了跨域请求的问题，还没有解释这部分代码