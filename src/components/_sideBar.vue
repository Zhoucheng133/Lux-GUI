<template>
  <div class="body">
    <div class="selectedLine"></div>
    <div class="item">
      <svg style="margin-right: 10px;" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 24.0083V42H42V24" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 23L24 32L15 23" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M23.9917 6V32" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      下载列表
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
}
</script>

<style scoped>
.selectedLine{
  position: fixed;
  height: 30px;
  width: 4px;
  background-color: rgb(0, 166, 255);
  border-radius: 2px;
  top: 0;
  left: 0;
}
.body{
  padding-top: 30px;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.item_selected{
  display: flex;
  align-items: center;
  width: calc(100% - 20px);
  height: 50px;
  border-radius: 10px;
}
.item:hover{
  background-color: rgb(220, 220, 220);
  cursor: pointer;
}
.item{
  padding-left: 20px;
  display: flex;
  align-items: center;
  width: calc(100% - 20px);
  height: 50px;
  border-radius: 10px;
  transition: background-color linear .2s;
}
</style>