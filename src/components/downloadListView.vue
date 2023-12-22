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
        placeholder="输入下载链接"
        class="linkInput"
        v-model="addLink">
      </el-input>
      <div class="addViewFoot" slot="footer">
        <el-checkbox style="margin-left: 5px;" v-model="m3u8Enable">使用m3u8下载</el-checkbox>
        <div class="cancelButton" @click="cancelDownload">取消</div>
        <div class="downloadButton" @click="downloadHandler">下载</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAdd: true,
      addLink: "",
      m3u8Enable: false,
    }
  },
  methods: {
    newDownloadClick(){
      this.showAdd=true;
    },
    cancelDownload(){
      this.showAdd=false;
      this.addLink="";
    },
    downloadHandler(){
      if(this.addLink==""){
        this.$message.error("没有输入下载链接")
      }else{
        // TODO 添加到下载队列
        this.showAdd=false;
        this.addLink="";
      }
    }
  },
}
</script>

<style>
.el-dialog__body{
  padding-top: 10px !important;
  padding-bottom: 0 !important;
}
</style>

<style scoped>
.cancelButton{
  margin-right: 10px;
  border: 1px solid white;
  margin-left: auto;
}
.downloadButton:hover{
  background-color: grey;
}
.cancelButton:hover{
  border: 1px solid grey;
}
.cancelButton:hover, .downloadButton:hover{
  cursor: pointer;
}
.downloadButton{
  background-color: rgb(160, 160, 160);
  color: white;
}
.cancelButton, .downloadButton{
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 5px;
  transition: all .2s linear;
}
.addViewFoot{
  display: flex;
  font-size: 14px;
  align-items: center;
}
.checkBox{
  margin-top: 10px;
  display: flex;
  padding-left: 5px;
}
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