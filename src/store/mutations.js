import * as types from './mutation-types'

export default {
    // 增加总时间
  [types.ADD_TOTAL_TIME] (state, time) {
    state.totalTime = Number(state.totalTime) + Number(time)
  },
  // 减少总时间
  [types.DEC_TOTAL_TIME] (state, time) {
    state.totalTime = Number(state.totalTime) - Number(time)
  },
  [types.SAVE_TOTAL_TIME] (state, time) {
    state.totalTime = Number(time)
  },
  // 保存从后台拿到的所有计划
  [types.SAVE_PLANS] (state, plans) {
    state.planArr = plans
  },
  // 新增计划
  [types.APPEND_PLAN] (state, plan) {
    state.planArr.push(plan)
  },
  // 删除某计划
  [types.DELETE_PLAN] (state, idx) {
    state.planArr.splice(idx, 1)
  }
}
