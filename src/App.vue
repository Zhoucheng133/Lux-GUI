<template>
  <div id="app">
    <div class="titleBar"></div>
    <div class="content">
      hello!
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  
}
</script>

<style>
.titleBar{
  position: fixed;
  top: 0;
  left: 0;
  height: 30px;
  width: 100%;
  -webkit-app-region: drag;
}

body{
  margin: 0;
}

.content{
  margin-top: 30px
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
