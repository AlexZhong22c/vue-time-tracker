<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>日期</label>
        <input
          type="date"
          class="form-control"
          v-model="date"
          placeholder="Date"
        />
      </div>
      <div class="col-sm-6">
        <label>时间</label>
        <input
          type="number"
          class="form-control"
          v-model="totalTime"
          placeholder="Hours"
        />
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-12">
        <label>备注</label>
        <input
          type="text"
          class="form-control"
          v-model="comment"
          placeholder="Comment"
        />
      </div>
    </div>
    <button class="btn btn-primary" @click="save()">保存</button>
    <router-link to="/time-entries" class="btn btn-danger">取消</router-link>
    <hr>
  </div>
</template>

<script>
  export default {
    name: 'LogTime',
    data () {
      return {
        date: '',
        totalTime: '',
        comment: ''
      }
    },
    methods: {
      save () {
        const plan = {
          name: '二哲',
          image: 'https://sfault-avatar.b0.upaiyun.com/888/223/888223038-5646dbc28d530_huge256',
          date: this.date,
          totalTime: this.totalTime,
          comment: this.comment
        }
        this.$store.dispatch('savePlan', plan)
        this.$store.dispatch('addTotalTime', this.totalTime)
        console.log('before store:' + typeof (this.totalTime))
        this.$router.go(-1)
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
