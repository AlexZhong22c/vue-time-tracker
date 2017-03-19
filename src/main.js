// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import Hello from './components/Hello.vue'
// import Home from './components/Home.vue'
import router from './router'

// import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueResource)
// Vue.use(VueRouter)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

// const router = new VueRouter()

// router.map({
//   '/Home': {
//     component: Home
//   }
// })

// router.redirect({
//   '*': '/Home'
// })

// router.start(App, '#app')

// new Vue({
//   el: '#app',
//   router: router,
//   template: App
// })
