import Vue from 'vue'
import App from './App'
import Home from './components/Home.vue'
import TimeEntries from './components/TimeEntries.vue'

// import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

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
  ...App
})
