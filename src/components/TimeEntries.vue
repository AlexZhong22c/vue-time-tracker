<template>
  <div>
    <router-link
      v-if="$route.path !== '/time-entries/log-time'"
      to="/time-entries/log-time"
      class="btn btn-primary">
      创建
    </router-link>

    <div v-if="$route.path === '/time-entries/log-time'">
      <h3>创建</h3>
    </div>

    <hr>

    <router-view></router-view>

    <div class="time-entries">
      <p v-if="!timeEntries.length"><strong>还没有任何计划</strong></p>

      <div class="list-group">
        <a class="list-group-item" v-for="timeEntry in timeEntries">
          <div class="row">
          <div class="col-sm-2 user-details">
            <img src="http://olqa2s510.bkt.clouddn.com/logo.jpg" class="avatar img-circle img-responsive" alt="logo" />
            <p class="text-center">
              <strong>
                Alex Zhong
              </strong>
            </p>
          </div>

            <div class="col-sm-2 text-center time-block">
              <h3 class="list-group-item-text total-time">
                <i class="glyphicon glyphicon-time"></i>
                {{ timeEntry.totalTime }}
              </h3>
              <p class="label label-primary text-center">
                <i class="glyphicon glyphicon-calendar"></i>
                {{ timeEntry.date }}
              </p>
            </div>

            <div class="col-sm-7 comment-section">
              <p>{{ timeEntry.comment }}</p>
            </div>

            <div class="col-sm-1">
              <button
                class="btn btn-xs btn-danger delete-button"
                @click="deleteTimeEntry(timeEntry)">
                X
              </button>
            </div>
          </div>
        </a>

      </div>
    </div>
    <div style="text-align:center;font-size:20px;" v-if="isLoading">
    <strong>data is Loading...</strong>
  </div>
  </div>
</template>

<script>
  export default {
    name: 'TimeEntries',
    data () {
      return {
        isLoading: false // 目前是否位于正在加载状态
      }
    },
    created () {
      // 组件创建完后获取数据，此时 data 已经被 observed 了
      // 在created的时机执行，是因为我们fetchData()要判断isLoading的状态
      this.fetchData()
    },
    // watch: {
    //   watch可以和计算属性做比较
    //   如果路由有变化，会再次执行该方法
    //   由于我们用了vuex--让timeEntries作为计算属性就能拿到数据，不必fetchData
    //   '$route': 'fetchData'
    // },
    computed: {
      timeEntries () {
        // 从store中取出数据，这个demo里timeEntry其实等同于plan !!
        return this.$store.state.planArr
      }
    },
    methods: {
      fetchData () {
        this.isLoading = true
        this.$http.get('http://localhost:8888/time-entries')
          .then(function (ret) {
            this.$store.dispatch('savePlans', ret.data)
            this.isLoading = false
          })
          .then(function (err) {
            console.log(err)
          })
      },
      deleteTimeEntry (timeEntry) {
        let index = this.timeEntries.indexOf(timeEntry)
        let _id = this.timeEntries[index]._id
        if (window.confirm('确认删除?')) {
          // 去到后台，数据库根据_id来删除对应记录
          this.$http.delete('http://localhost:8888/delete/' + _id)
            .then(function (ret) {
              console.log(ret)
            })
            .then(function (err) {
              console.log(err)
            })
          // this.$dispatch('deletePlan', timeEntry)，事件*通信*的写法
          // $dispatch是vue1.x的写法，现已被废除，改为vuex来*通信*：
          this.$store.dispatch('deletePlan', timeEntry)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .avatar {
    height: 75px;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .user-details {
    background-color: #f5f5f5;
    border-right: 1px solid #ddd;
    margin: -10px 0;
  }
  .time-block {
    padding: 10px;
  }
  .comment-section {
    padding: 20px;
  }
</style>
