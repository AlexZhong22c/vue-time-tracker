<template>
  <div class="jumbotron">
    <h1>任务追踪</h1>
    <p>
      <strong>
        <router-link to="/time-entries">创建一个任务</router-link>
      </strong>
    </p>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
