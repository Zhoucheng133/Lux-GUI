<template>
  <div class="app">
    <div class="titleBar">
      <div class="title">设置</div>
    </div>
    <div class="diviline"></div>
    <div class="content">
      <div class="item">
        <div class="itemText">Lux程序路径</div>
        <div class="itemIndex">
          <el-input v-model="luxPathInput" :readonly=true>
            <el-button @click="pickLuxPath" type="primary" slot="append">
              <svg width="13" height="13" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9V41L9 21H39.5V15C39.5 13.8954 38.6046 13 37.5 13H24L19 7H6C4.89543 7 4 7.89543 4 9Z" stroke="#9b9b9b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 41L44 21H8.8125L4 41H40Z" fill="none" stroke="#9b9b9b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </el-button>
          </el-input>
        </div>
      </div>
      <div class="item">
        <div class="itemText">FFmpeg路径</div>
        <div class="itemIndex">
          <el-input v-model="ffmpegPathInput" :spellcheck="false">
            <el-button @click="pickFFmpegPath" type="primary" slot="append">
              <svg width="13" height="13" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9V41L9 21H39.5V15C39.5 13.8954 38.6046 13 37.5 13H24L19 7H6C4.89543 7 4 7.89543 4 9Z" stroke="#9b9b9b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 41L44 21H8.8125L4 41H40Z" fill="none" stroke="#9b9b9b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </el-button>
          </el-input>
        </div>
      </div>
      <div class="item">
        <div class="itemText">默认下载路径</div>
        <div class="itemIndex">
          <el-input v-model="savePathInput" :readonly=true>
            <el-button @click="pickSavePath" type="primary" slot="append">
              <svg width="13" height="13" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9V41L9 21H39.5V15C39.5 13.8954 38.6046 13 37.5 13H24L19 7H6C4.89543 7 4 7.89543 4 9Z" stroke="#9b9b9b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 41L44 21H8.8125L4 41H40Z" fill="none" stroke="#9b9b9b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </el-button>
          </el-input>
        </div>
      </div>
      <div class="item" style="align-items: flex-start;">
        <div class="itemText">默认Header</div>
        <div>
          <el-input type="textarea" v-model="headerInput" :rows="3" resize="none" :spellcheck="false"></el-input>
          <div style="display: flex;">
            <div class="saveHeaderBt" @click="saveHeader">保存Header</div>
          </div>
        </div>
      </div>
      <div class="item" style="align-items: flex-start;">
        <div class="itemText">关于</div>
        <div class="aboutContent">
          <img src="@/icon.png" alt="" width="100px">
          <div class="appName">Lux GUI</div>
          <div class="appVer">{{ appVer }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
export default {
  data() {
    return {
      luxPathInput: "",
      ffmpegPathInput: "",
      savePathInput: "",
      headerInput: "",

      appVer: "",
    }
  },
  methods: {
    saveHeader(){
      localStorage.setItem("header", this.headerInput);
      this.$message.success({"message": "已保存默认Header", offset: 50, duration: 2000});
      this.$emit("saveHeader", this.headerInput);
    },
    submitSettings(){
      // console.log(this.luxPathInput, this.savePathInput);
      localStorage.setItem("luxPath", this.luxPathInput);
      localStorage.setItem("savePath", this.savePathInput);
      localStorage.setItem("ffmpegPath", this.ffmpegPathInput);
      this.$emit("changeSettings", this.luxPathInput, this.savePathInput, this.ffmpegPathInput);
    },
    getLuxPath(event, arg){
      if(arg==""){
        return;
      }
      this.luxPathInput=arg;
    },
    getSavePath(event, arg){
      if(arg==undefined){
        this.savePathInput="";
        return;
      }
      if(arg==""){
        return;
      }
      this.savePathInput=arg;
    },
    getFFmpegPath(event, arg){
      if(arg==""){
        return;
      }
      this.ffmpegPathInput=arg;
    },
    pickSavePath(){
      ipcRenderer.send('pickSavePath');
    },
    pickLuxPath(){
      ipcRenderer.send('pickLuxPath');
    },
    pickFFmpegPath(){
      ipcRenderer.send('pickFFmpegPath');
    },
  },
  created() {
    ipcRenderer.removeAllListeners('getSavePath');
    ipcRenderer.removeAllListeners('getLuxPath');
    ipcRenderer.removeAllListeners('getFFmpegPath');
    ipcRenderer.on('getSavePath', this.getSavePath);
    ipcRenderer.on('getLuxPath', this.getLuxPath);
    ipcRenderer.on('getFFmpegPath', this.getFFmpegPath);

    if(localStorage.getItem("luxPath")!=null && localStorage.getItem("luxPath")!=""){
      this.luxPathInput=localStorage.getItem("luxPath");
    }
    if(localStorage.getItem("ffmpegPath")!=null && localStorage.getItem("ffmpegPath")!=""){
      this.ffmpegPathInput=localStorage.getItem("ffmpegPath");
    }
    if(localStorage.getItem("savePath")!=null && localStorage.getItem("savePath")!=""){
      this.savePathInput=localStorage.getItem("savePath");
    }
    if(localStorage.getItem("header")!=null && localStorage.getItem("header")!=""){
      this.headerInput=localStorage.getItem("header");
    }
    this.submitSettings();
    this.appVer = process.env.VUE_APP_VERSION;
  },
  watch: {
    luxPathInput: function(){
      this.submitSettings();
    },
    savePathInput: function(){
      this.submitSettings();
    },
    ffmpegPathInput: function(){
      this.submitSettings();
    }
  },
}
</script>

<style>
.el-input__inner{
  height: 30px !important;
}
</style>

<style scoped>
.appVer{
  color: grey;
  font-size: 14px;
}
.appName{
  font-size: 16px;
  font-weight: bold;
}
.aboutContent{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.saveHeaderBt:hover{
  border: 1px solid rgb(0, 220, 210);
  color: rgb(0, 220, 210);
  cursor: pointer;
}
.saveHeaderBt{
  margin-left: auto;
  margin-top: 10px;
  border: 1px solid rgb(200, 200, 200);
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 5px;
  font-size: 14px;
  transition: all .2s linear;
}
.itemIndex{
  display: flex;
  align-items: center;
}
.itemText{
  text-align: right;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  align-items: center;
  font-size: 15px;
}
.item{
  margin-top: 30px;
  width: 450px;
  display: grid;
  grid-template-columns: 150px 300px;
}
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