<template>
  <div id="app">
    <div class="titleBar">
      <div class="windowOp" v-if="showWindowOp">
        <div class="minButton">
          <svg width="13" height="13" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 24L38.5 24" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="resizeButton">
          <svg width="13" height="13" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 42H6V26" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 6H42V22" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="closeButton">
          <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8L40 40" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 40L40 8" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
    </div>
    <div class="content">
      <listView />
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import listView from './components/listView.vue';
export default {
  beforeDestroy(){
    ipcRenderer.removeAllListeners('sysFeedback');
  },
  components: {
    listView
  },
  data() {
    return {
      isMax: false,
      showWindowOp: false,
    }
  },
  methods: {
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
    ipcRenderer.on('sysFeedback', this.sysFeedback);
    ipcRenderer.send('getSys');
  },
}
</script>

<style>
body{
  margin: 0;
  background-color: rgb(240, 240, 240) !important;
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
