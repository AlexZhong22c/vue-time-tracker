import Vue from 'vue'
import App from './App'
import Home from './components/Home.vue'
import TimeEntries from './components/TimeEntries.vue'

// import router from './router' // 可以将路由放到另外一个文件里
import store from './store' // 这个文件夹和vuex有关
// import 'bootstrap/dist/css/bootstrap.css' // 这个项目直接在头部link标签引入bootstrap的CDN，所以暂时不需要import

import VueRouter from 'vue-router'
import VueResource from 'vue-resource' // 先用着vue-resource，之后会改为axios

Vue.use(VueResource)
Vue.use(VueRouter)

Vue.config.productionTip = false

/* eslint-disable no-new */
const routes = [{
  path: '/',
  component: Home
},
{
  path: '/home',
  component: Home
},
{
  path: '/time-entries',
  component: TimeEntries,
  children: [{
    path: 'log-time',
    component: resolve => require(['./components/LogTime.vue'], resolve)
  }]
}
]

const router = new VueRouter({
  routes
})

/* eslint-disable no-new */
// 实例化我们的Vue
new Vue({
  el: '#app',
  router,
  store,
  // ...App等价于render:h => h(App)
  ...App
})
