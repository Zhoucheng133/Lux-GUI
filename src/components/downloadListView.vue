<template>
  <div class="app">
    <div class="titleBar">
      <div class="title">下载列表</div>
      <div class="addButton" @click="newDownloadClick">
        <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.0605 10L24.0239 38" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 24L38 24" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
    </div>
    <div class="diviline"></div>

    <el-dialog :visible.sync="showAdd" width="600px">
      <div class="addViewTitle" slot="title">
        新建下载任务
      </div>
      <el-input
        type="textarea"
        :rows="5" 
        resize="none"
        placeholder="请输入内容"
        class="linkInput"
        v-model="addLink">
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAdd: true,
      addLink: ""
    }
  },
  methods: {
    newDownloadClick(){
      this.showAdd=true;
    }
  },
}
</script>

<style>
.el-dialog__body{
  padding-top: 10px;
}
</style>

<style scoped>
.addViewTitle{
  text-align: left;
  font-size: 15px;
  font-weight: bolder;
}
.addButton:hover{
  cursor: pointer;
  background-color: rgb(230, 230, 230);
}
.addButton{
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 8px 8px 8px 8px;
  transition: background-color .2s linear;
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