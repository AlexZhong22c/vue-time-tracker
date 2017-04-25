import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

// 先写个假数据
const state = {
  totalTime: 0,
  planArr: []
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
