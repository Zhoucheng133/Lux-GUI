<template>
  <div class="app">
    <div class="titleBar">
      <div class="title">完成列表</div>
    </div>
    <div class="diviline"></div>
    <div class="content">
      完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>
      完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>
      完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>
      完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>
      完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>
      完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表<br>完成列表
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    
  },
}
</script>

<style scoped>
.content{
  width: 100%;
  display: flex;
  height: calc(100vh - 30px - 40px - 46px);
  overflow: auto;
  flex-direction: column;
  align-items: center;
}
.diviline{
  width: 100%;
  height: 1px;
  border-color: lightgrey;
  background-color: lightgrey;
}
.title{
  font-size: 18px;
  font-weight: bolder;
}
.titleBar{
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  height: 35px;
}
.app{
  user-select: none;
  padding: 20px 20px 20px 20px;
}
</style>