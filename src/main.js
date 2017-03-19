// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import Hello from './components/Hello.vue'
import Home from './components/Home.vue'
// import router from './router'
import store from './store'
import TimeEntries from './components/TimeEntries.vue'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueResource)
Vue.use(VueRouter)

Vue.config.productionTip = false

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   template: '<App/>',
//   components: { App }
// })

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
  ...App
})
