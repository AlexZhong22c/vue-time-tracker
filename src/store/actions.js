import * as types from './mutation-types'
// actions中的函数接受一个与store实例有相同属性和方法的context对象
// 因此可以调用context中包含的state,getters以及mutations中定义的方法
// userLogin(context){
//   context.commit(types.LOGIN);
// }
// 使用es6的函数参数结构简化代码，可以直接将context.commit => commit使用
// 在.vue文件中通过store.dispatch('userLogin') 即可触发状态改变了

// 这里的第二个参数是因为提交mutations时需要获取的参数

// 一个actions分发两个mutations ，不知道对不对??
export default {
  // addTotalTime ({ commit }, time) {
  //   commit(types.ADD_TOTAL_TIME, time)
  // },
  // decTotalTime ({ commit }, time) {
  //   commit(types.DEC_TOTAL_TIME, time)
  // },
  saveTotalTime ({ commit }, totalTime) {
    commit(types.SAVE_TOTAL_TIME, totalTime)
  },
  savePlans ({ commit }, plans) {
    commit(types.SAVE_PLANS, plans)
  },
  appendPlan ({ commit }, plan) {
    commit(types.APPEND_PLAN, plan)
    commit(types.ADD_TOTAL_TIME, plan.totalTime)
  },
  deletePlan ({ commit, state }, plan) {
    let index = state.planArr.indexOf(plan)
    commit(types.DELETE_PLAN, index)

    commit(types.DEC_TOTAL_TIME, plan.totalTime)
  }
}
