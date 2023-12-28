<template>
  <div id="app">
    <div class="titleBar">
      <div class="windowOp" v-if="showWindowOp">
        <div class="minButton" @click="winMin">
          <svg width="13" height="13" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 24L38.5 24" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="resizeButton" v-if="!isMax" @click="winMax">
          <svg width="13" height="13" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 42H6V26" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 6H42V22" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="resizeButton" v-else @click="winRestore">
          <svg width="13" height="13" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 20H28V4" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 28H20V44" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="closeButton" @click="winClose">
          <svg width="13" height="13" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8L40 40" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 40L40 8" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
    </div>
    <sideBar class="sideBar" 
      @setNowPage="setNowPage" 
      :nowPage="nowPage" />
    <div class="content">
      <downloadListView v-show="nowPage=='downloadList'" :savePath="savePath" :luxPath="luxPath" :header="header" :ffmpegPath="ffmpegPath" @updateList="updateList" :list="list" @delFile="delFile"/>
      <completeListView v-show="nowPage=='completeList'" :list="list" @delFile="delFile" />
      <settingsView v-show="nowPage=='settings'" :savePath="savePath" :luxPath="luxPath" @changeSettings="changeSettings" @saveHeader="saveHeader"/>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

import sideBar from './components/_sideBar.vue';
import downloadListView from './components/downloadListView.vue';
import completeListView from './components/completeListView.vue';
import settingsView from './components/settingsView.vue';
export default {
  beforeDestroy(){
    ipcRenderer.removeAllListeners('sysFeedback');
  },
  components: {
    downloadListView,
    completeListView,
    settingsView,
    sideBar
  },
  data() {
    return {
      isMax: false,
      showWindowOp: false,

      // nowPage: "settings",
      nowPage: "downloadList",

      savePath: "",
      luxPath: "",
      ffmpegPath: "",
      header: "",

      // 下载的所有列表
      list: [],
    }
  },
  methods: {
    delFile(arg){
      if(arg.percentage==100){
        this.list=this.list.filter(item => !(item.title === arg.title && item.pid === arg.pid));
        var savedList=this.list.filter((item)=>{
          return item.percentage==100;
        })
        localStorage.setItem("savedList", JSON.stringify(savedList));
      }else{
        this.$confirm('下载还没有完成，是否要停止下载？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ipcRenderer.send("stopDownload", arg.pid);
        }).catch(() => {

        })
      }
    },
    getStop(event, pid){
      console.log(this.list);
      console.log(pid);
      this.list=this.list.filter(item => !(item.pid == pid));
      // setTimeout(() => {
      //   this.list=this.list.filter(item => !(item.pid == pid));
      // }, 100);
    },
    updateList(arg){
      const existingItemIndex = this.list.findIndex(item => item.pid === arg.pid);
      if (existingItemIndex !== -1) {
        this.list[existingItemIndex].percentage = arg.percentage;
      } else {
        this.list.push(arg);
      }
      this.$forceUpdate()

      console.log(arg.percentage);
      if(arg.percentage==100){
        console.log(this.list);
        var savedList=this.list.filter((item)=>{
          return item.percentage==100;
        })
        localStorage.setItem("savedList", JSON.stringify(savedList));
      }
    },
    saveHeader(header){
      this.header=header;
    },
    changeSettings(luxPath, savePath, ffmpegPath){
      this.luxPath=luxPath;
      this.savePath=savePath;
      this.ffmpegPath=ffmpegPath;
    },
    setNowPage(val){
      this.nowPage=val;
    },
    winClose(){
      ipcRenderer.send('winClose');
    },
    winRestore(){
      ipcRenderer.send('winRestore');
      this.isMax=false;
    },
    winMax(){
      ipcRenderer.send('winMax');
      this.isMax=true;
    },
    winMin(){
      ipcRenderer.send('winMin');
    },
    sysFeedback(event, sys){
      if(sys=="macOS"){
        this.showWindowOp=false;
      }else{
        this.showWindowOp=true;
      }
    }
  },
  created() {
    ipcRenderer.removeAllListeners('sysFeedback');
    ipcRenderer.removeAllListeners('getStop');
    ipcRenderer.on('sysFeedback', this.sysFeedback);
    ipcRenderer.on('getStop', this.getStop);
    ipcRenderer.send('getSys');
    if(localStorage.getItem("header")!=null && localStorage.getItem("header")!=""){
      this.header=localStorage.getItem("header");
    }
    if(localStorage.getItem("savedList")){
      this.list=JSON.parse(localStorage.getItem("savedList"));
    }
  },
}
</script>

<style>
.sideBar{
  position: fixed;
  width: 160px;
}
body{
  margin: 0;
  background-color: rgb(240, 240, 240) !important;
  height: 100vh;
}
</style>

<style scoped>
.closeButton:hover{
  background-color: rgb(200, 0, 0);
  /* cursor: pointer; */
}
.closeButton{
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all linear .2s;
  background-color: red;
}
.minButton:hover, .resizeButton:hover{
  background-color: lightgrey;
  /* cursor: pointer; */
}
.minButton, .resizeButton{
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all linear .2s;
}
.windowOp{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.titleBar{
  /* position: fixed; */
  top: 0;
  left: 0;
  height: 30px;
  width: 100%;
  -webkit-app-region: drag;
}

.content{
  /* margin-top: 30px; */
  /* transform: translateY(-30px); */
  background-color: white;
  margin-left: 160px;
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
