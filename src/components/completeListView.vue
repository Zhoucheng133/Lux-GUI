<template>
  <div class="app">
    <div class="titleBar">
      <div class="title">完成列表</div>
    </div>
    <div class="diviline"></div>
    <div class="content">
      <div v-for="(item, index) in list" :key="index" style="width: 100%;">
        <div class="downloadItem" v-if="item.percentage==100" @dblclick="openFile(item.downloadPath, item.title, item.percentage)">
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
    </div>
  </div>
</template>

<script>
import { ipcRenderer, shell } from 'electron';
export default {
  props: {
    list: Array,
  },
  data() {
    return {
      
    }
  },
  methods: {
    delFile(item){
      this.$emit("delFile", item);
    },
    showSizeInfo(size, percentage){
      const modifiedSize = size.replace('MiB', 'MB');
      // 将 percentage 转换为数字，并保留两位小数
      // 构建结果字符串
      const result = `${(size.split(' ')[0] * percentage / 100).toFixed(2)}MB / ${modifiedSize}`;
      return result;
    },
    openFolder(path){
      if(path){
        shell.openPath(path);
      }
    },
    openFile(savePath, title, percentage){
      if(savePath && title && percentage==100){
        // shell.openPath(path.join(savePath, `${title}.mp4`));
        ipcRenderer.send('openFile', savePath, title);
      }
    },
  },
}
</script>

<style scoped>
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