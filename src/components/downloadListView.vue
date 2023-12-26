<template>
  <div class="app">
    <div class="titleBar">
      <div class="title">下载列表</div>
      <div class="addButton" @click="newDownloadClick">
        <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.0605 10L24.0239 38" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 24L38 24" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
    </div>
    <div class="diviline"></div>
    <div class="content">
      <div class="downloadItem" v-for="(item, index) in list" :key="index" @dblclick="openFile(item.downloadPath, item.title, item.percentage)">
        <div class="fileTitleBar">
          <div class="fileTitle">
            {{ item.title }}
          </div>
          <div class="operations">
            <div class="openFolder" @click="openFolder(item.downloadPath)">
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9V41L9 21H39.5V15C39.5 13.8954 38.6046 13 37.5 13H24L19 7H6C4.89543 7 4 7.89543 4 9Z" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 41L44 21H8.8125L4 41H40Z" fill="none" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="delFile" @click="delFile(item)">
              <svg width="12" height="12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8L40 40" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 40L40 8" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
        </div>
        <div class="progress">
          <el-progress :percentage="Math.round(item.percentage)"></el-progress>
          <div class="sizeInfo">{{ showSizeInfo(item.size, item.percentage) }}</div>
        </div>
      </div>
    </div>

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
          <el-button @click="pickDownloadPath" type="primary" slot="append">
            <svg width="13" height="13" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9V41L9 21H39.5V15C39.5 13.8954 38.6046 13 37.5 13H24L19 7H6C4.89543 7 4 7.89543 4 9Z" stroke="#9b9b9b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 41L44 21H8.8125L4 41H40Z" fill="none" stroke="#9b9b9b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </el-button>
        </el-input>
      </div>
      <div class="addViewFoot" slot="footer">
        <el-checkbox v-model="m3u8Enable">使用m3u8下载</el-checkbox>
        <el-checkbox v-model="headerEnable">使用默认Header</el-checkbox>
        <div class="cancelButton" @click="cancelDownload">取消</div>
        <div :class="loading ? 'downloadButton_disable':'downloadButton'" @click="downloadHandler">
          <div v-if="loading" class="loadingIcon">
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div v-else>
            下载
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer, shell } from 'electron';
export default {
  props: {
    savePath: String,
    luxPath: String,
    ffmpegPath: String,
    header: String,
    list: Array,
    
  },
  data() {
    return {
      showAdd: false,
      addLink: "",
      m3u8Enable: false,
      headerEnable: true,

      downloadPath: "",

      loading: false,
    }
  },
  methods: {
    delFile(item){
      this.$emit("delFile", item);
    },
    openFile(savePath, title, percentage){
      if(savePath && title && percentage==100){
        // shell.openPath(path.join(savePath, `${title}.mp4`));
        ipcRenderer.send('openFile', savePath, title);
      }
    },
    openFolder(path){
      if(path){
        shell.openPath(path);
      }
    },
    showSizeInfo(size, percentage){
      const modifiedSize = size.replace('MiB', 'MB');
      // 将 percentage 转换为数字，并保留两位小数
      // 构建结果字符串
      const result = `${(size.split(' ')[0] * percentage / 100).toFixed(2)}MB / ${modifiedSize}`;
      return result;
    },
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
      }else if(this.ffmpegPath==""){
        this.$message.error({message: "没有设置FFmpeg路径", offset: 50, duration: 2000})
      }else{
        this.downloadPath=this.savePath
        this.showAdd=true;
      }
    },
    cancelDownload(){
      this.showAdd=false;
      setTimeout(() => {
        this.addLink="";
        this.downloadPath="";
        this.headerEnable=true;
      }, 500);
    },
    closeAddDownload(){
      this.showAdd=false;
      setTimeout(() => {
        this.addLink="";
        this.m3u8Enable=false;
        this.downloadPath="";
      }, 200);
    },
    downloadHandler(){
      if(this.loading){
        return;
      }
      if(this.addLink==""){
        this.$message.error({message: "没有输入下载链接", offset: 50, duration: 2000});
      }else if(this.downloadPath==""){
        this.$message.error({message: "没有选择保存位置", offset: 50, duration: 2000});
      }else{
        if(this.headerEnable){
          ipcRenderer.send('luxDownload', this.addLink, this.luxPath, this.savePath, this.ffmpegPath, this.downloadPath, this.header);
        }else{
          ipcRenderer.send('luxDownload', this.addLink, this.luxPath, this.savePath, this.ffmpegPath, this.downloadPath);
        }
        this.loading=true;
      }
    },
    downloadingHandler(event, arg){
      if(this.loading){
        this.loading=false;
        this.closeAddDownload();
      }
      this.$emit("updateList", arg);
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
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loadingIcon{
  display: flex;
  justify-content: center;
  align-items: center;
  animation: rotate 1s linear infinite;
}
.sizeInfo{
  font-size: 14px;
  text-align: right;
}
.progress{
  display: grid;
  width: calc(100% - 35px);
  margin-left: 10px;
  margin-top: 20px;
  grid-template-columns: auto 180px;
}
.fileTitle{
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 50px;
}
.openFolder{
  margin-right: 20px;
}
.openFolder:hover{
  cursor: pointer;
}
.delFile:hover{
  cursor: pointer;
}
.operations{
  margin-left: auto;
  display: flex;
}
.fileTitleBar{
  margin-left: 15px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  width: calc(100% - 40px);
  font-size: 15px;
}
.downloadItem:hover{
  border: 1px solid grey;
}
.downloadItem{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100px;
  background-color: white;
  /* width: calc(100% - 30px); */
  width: calc(100% - 2px);
  border-radius: 10px;
  border: 1px solid rgb(160, 160, 160);
  margin-top: 10px;
  transition: all linear .2s;
}
.content{
  width: 100%;
  display: flex;
  height: calc(100vh - 30px - 40px - 46px);
  overflow: auto;
  flex-direction: column;
  align-items: center;
}
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
  background-color: rgb(0, 187, 177);
}
.cancelButton:hover{
  border: 1px solid rgb(0, 218, 207);
  color: rgb(0, 218, 207);
}
.cancelButton:hover, .downloadButton:hover{
  cursor: pointer;
}
.downloadButton{
  background-color: rgb(0, 218, 207);
  color: white;
}
.downloadButton_disable{
  background-color: lightgrey;
  color: white;
  cursor: not-allowed;
  border: 1px solid white;
  height: 20px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cancelButton, .downloadButton, .downloadButton_disable{
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