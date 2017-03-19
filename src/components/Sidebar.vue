<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h1 class="text-center">已有时长</h1> </div>
        <div class="panel-body">
            <h1 class="text-center">{{ time }} 小时</h1> </div>
    </div>
</template>

<script>
export default {
  computed: {
    time () {
      return this.$store.state.totalTime
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
