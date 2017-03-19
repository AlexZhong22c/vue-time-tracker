import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import Home from '@/components/Home.vue'
import TimeEntries from '@/components/TimeEntries.vue'
// import LogTime from '@/components/LogTime.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/time-entries',
      name: 'TimeEntries',
      component: TimeEntries,
      children: [
        {
          path: '/log-time',
          component: resolve => require(['@/components/LogTime.vue'], resolve)
        }
      ]
    }
  ]
})
