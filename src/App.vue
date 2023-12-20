<template>
  <div id="app">
    <div class="titleBar"></div>
    <div class="content">
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
  background-color: rgb(240, 240, 240);
}

.content{
  /* margin-top: 30px; */
  margin-top: 30px;
  background-color: white;
  margin-left: 200px;
  height: calc(100vh - 40px);
  margin-right: 10px;
  border-radius: 10px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
