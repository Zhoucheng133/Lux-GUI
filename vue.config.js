const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      // 对于macOS，分别导出x64版本和Apple Silicon版本
      builderOptions: {
        artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
        mac: {
          target: {
            arch: ['x64', 'arm64'],
            target: 'zip'
          }
        }
      },
    },
  },
})
