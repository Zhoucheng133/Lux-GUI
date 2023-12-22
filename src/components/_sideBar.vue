<template>
  <div class="body">
    <div :class="nowPage=='downloadList' ? 'item_selected' : 'item'" @click="setNowPage('downloadList')" ref="downloadListRef">
      <svg class="menuIcon" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 24.0083V42H42V24" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 23L24 32L15 23" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M23.9917 6V32" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      下载列表
    </div>
    <div :class="nowPage=='completeList' ? 'item_selected' : 'item'" @click="setNowPage('completeList')" ref="completeListRef">
      <svg class="menuIcon" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z" fill="none" stroke="#000000" stroke-width="4" stroke-linejoin="round"/><path d="M16 24L22 30L34 18" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      完成列表
    </div>
    <div class="bottom">
      <div :class="nowPage=='settings' ? 'item_selected' : 'item'" @click="setNowPage('settings')" ref="settingsRef">
        <svg class="menuIcon" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4L18 10H10V18L4 24L10 30V38H18L24 44L30 38H38V30L44 24L38 18V10H30L24 4Z" fill="none" stroke="#000000" stroke-width="4" stroke-linejoin="round"/><path d="M24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30Z" fill="none" stroke="#000000" stroke-width="4" stroke-linejoin="round"/></svg>
        设置
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nowPage: String,
  },
  data() {
    return {
      setNowPage(val){
        this.$emit("setNowPage", val)
      }
    }
  },
}
</script>

<style scoped>
.bottom{
  position: fixed;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.menuIcon{
  margin-right: 10px; 
  margin-left: 15px;
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
  width: 140px;
  height: 45px;
  border-radius: 10px;
  transition: background-color linear .2s;
  background-color: rgb(220, 220, 220);
}
.item:hover{
  background-color: rgb(230, 230, 230);
  cursor: pointer;
}
.item{
  display: flex;
  align-items: center;
  height: 45px;
  border-radius: 10px;
  transition: background-color linear .2s;
  width: 140px;
}
</style>