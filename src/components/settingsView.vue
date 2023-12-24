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
            <el-button @click="pickLuxPath" type="primary" slot="append" icon="el-icon-folder-opened"></el-button>
          </el-input>
        </div>
      </div>
      <div class="item">
        <div class="itemText">默认下载路径</div>
        <div class="itemIndex">
          <el-input v-model="savePathInput" :readonly=true>
            <el-button @click="pickSavePath" type="primary" slot="append" icon="el-icon-folder-opened"></el-button>
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
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
export default {
  data() {
    return {
      luxPathInput: "",
      savePathInput: "",
      headerInput: "",
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
      this.$emit("changeSettings", this.luxPathInput, this.savePathInput);
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

    pickSavePath(){
      ipcRenderer.send('pickSavePath');
    },
    pickLuxPath(){
      ipcRenderer.send('pickLuxPath');
    },
  },
  created() {
    ipcRenderer.removeAllListeners('getSavePath');
    ipcRenderer.removeAllListeners('getLuxPath');
    ipcRenderer.on('getSavePath', this.getSavePath);
    ipcRenderer.on('getLuxPath', this.getLuxPath);

    if(localStorage.getItem("luxPath")!=null && localStorage.getItem("luxPath")!=""){
      this.luxPathInput=localStorage.getItem("luxPath");
    }
    if(localStorage.getItem("savePath")!=null && localStorage.getItem("savePath")!=""){
      this.savePathInput=localStorage.getItem("savePath");
    }
    if(localStorage.getItem("header")!=null && localStorage.getItem("header")!=""){
      this.headerInput=localStorage.getItem("header");
    }
    this.submitSettings();
  },
  watch: {
    luxPathInput: function(){
      this.submitSettings();
    },
    savePathInput: function(){
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
.saveHeaderBt:hover{
  border: 1px solid grey;
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
  /* background-color: red; */
  display: flex;
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