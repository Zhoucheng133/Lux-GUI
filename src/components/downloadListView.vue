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
      <div class="downloadPath">
        <div class="pathText">保存位置</div>
        <el-input v-model="downloadPath" :readonly=true>
          <el-button @click="pickDownloadPath" type="primary" slot="append" icon="el-icon-folder-opened"></el-button>
        </el-input>
      </div>
      <div class="addViewFoot" slot="footer">
        <el-checkbox v-model="m3u8Enable">使用m3u8下载</el-checkbox>
        <el-checkbox v-model="headerEnable">使用默认Header</el-checkbox>
        <div class="cancelButton" @click="cancelDownload">取消</div>
        <div class="downloadButton" @click="downloadHandler">下载</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
export default {
  props: {
    savePath: String,
    luxPath: String,
    header: String,
  },
  data() {
    return {
      showAdd: false,
      addLink: "",
      m3u8Enable: false,
      headerEnable: true,

      list: [],
      downloadPath: "",
    }
  },
  methods: {
    pickDownloadPath(){
      ipcRenderer.send('pickDownloadPath');
    },
    getDownloadPath(event, arg){
      if(arg==undefined){
        this.savePathInput="";
        return;
      }
      if(arg==""){
        return;
      }
      this.downloadPath=arg;
    },
    newDownloadClick(){
      if(this.luxPath==""){
        this.$message.error({message: "没有设置Lux程序路径", offset: 50, duration: 2000})
      }else{
        this.downloadPath=this.savePath
        this.showAdd=true;
      }
    },
    cancelDownload(){
      this.showAdd=false;
      setTimeout(() => {
        this.addLink="";
        this.downloadPath=""
      }, 500);
    },
    downloadHandler(){
      if(this.addLink==""){
        this.$message.error({message: "没有输入下载链接", offset: 50, duration: 2000});
      }else{
        if(this.headerEnable){
          ipcRenderer.send('luxDownload', this.addLink, this.luxPath, this.savePath, this.header);
        }else{
          ipcRenderer.send('luxDownload', this.addLink, this.luxPath, this.savePath);
        }
        this.showAdd=false;
        this.addLink="";
        this.m3u8Enable=false;
        this.downloadPath="";
      }
    },
    downloadingHandler(event, arg){
      console.log(arg);
    }
  },
  created() {
    ipcRenderer.removeAllListeners('getDownloadPath');
    ipcRenderer.removeAllListeners('downloadingHandler');
    ipcRenderer.on('getDownloadPath', this.getDownloadPath);
    ipcRenderer.on('downloadingHandler', this.downloadingHandler);
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
.pathText{
  width: 80px;
  text-align: left;
}
.downloadPath{
  margin-top: 10px;
  display: flex;
  align-items: center;
}
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