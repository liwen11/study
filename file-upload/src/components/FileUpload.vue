<template>
  <div>
    <input type="file" @change='handleUploadFile'>
  </div>
</template>

<script>
// jpg开头两个仕 FF D8
// 结尾两个仕 FF D9
const FILE_TYPE_MAP = {
  '89 50 4E 47': 'png',
  '47 49 46 38': 'gif',
  '52 49 46 46': 'avi'
}
export default {
  methods: {
    async handleUploadFile(e) {
      let [file] = e.target.files
      if (!file) return 
      let fileType = await this.getFileType(file)
      if (fileType) {
        console.log(`当前上传文件类型为${fileType}`)
      } else {
        console.log('当前上传文件不合法')
      }
    },
    async getFileType(file) {
      let str = await this.blobToString(file, 0, 4)
      let fileType = FILE_TYPE_MAP[str]
      if (!fileType) {
        let len = file.size
        let a = await this.blobToString(file, 0, 2)
        let b = await this.blobToString(file, -2, len)
        if (a == 'FF D8' && b == 'FF D9') {
          fileType = 'jpg'
        }
      }
      return fileType
    },
    blobToString(file, start, end) {
      let reader = new FileReader()
      reader.readAsArrayBuffer(file)
      return new Promise((resolve, reject) => {
        reader.onload = function(e) {
          try {
            let arr = new Uint8Array(e.target.result).slice(start, end)
            console.log(arr)
            arr = [...arr]
            let a = arr.map(v => v.toString(16).toUpperCase().padStart(2, '0'))
              .join(' ')
            console.log(a)
            resolve(a)
          } catch (e) {
            reject(e)
          }
        }
      })
      
    }
  },
}
</script>

<style>

</style>