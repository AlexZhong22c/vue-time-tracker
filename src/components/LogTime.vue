<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>日期</label>
        <input
          type="date"
          class="form-control"
          v-model="timeEntry.date"
          placeholder="日期"
        />
      </div>
      <div class="col-sm-6">
        <label>所需时间</label>
        <input
          type="number"
          class="form-control"
          v-model="timeEntry.totalTime"
          placeholder="所需时间"
        />
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-12">
        <label>备注</label>
        <input
          type="text"
          class="form-control"
          v-model="timeEntry.comment"
          placeholder="备注"
        />
      </div>
    </div>
    <button class="btn btn-primary" @click="save()">保存</button>
    <!-- <button v-link="'/time-entries'" class="btn btn-danger">取消</button> -->
    <!-- router-link先改变路径。而vue-router再根据路径和 路由的配置 来决定子组件们是否加载 -->
    <!-- 如果某个子组件要被加载，就被加载到router-view标签处 -->
    <router-link to="/time-entries" class="btn btn-danger">取消</router-link>
    <hr>
  </div>
</template>
<style>
</style>
<script>
    export default{
      name:"logtime", // 给一个名字方便调试
      data () {
        return {
          timeEntry: {
            // 用v-model从表单处拿到数据
          }
        }
      },
      methods: {
        save () {
          this.$http.post('http://localhost:8888/create', {
            comment: this.timeEntry.comment,
            totalTime: this.timeEntry.totalTime,
            date: this.timeEntry.date
          }).then(function (ret) {
            let timeEntry = this.timeEntry
            this.$store.dispatch('appendPlan', timeEntry)
            this.timeEntry = {}
            this.$router.push('/time-entries')
          })
        }
      }
    }
</script>
