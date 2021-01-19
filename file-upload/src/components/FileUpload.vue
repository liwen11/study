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
      this.getHW(file, fileType)
    },
    async getFileType(file) {
      let str = await this.blobToString(file.slice(0, 4))
      let fileType = FILE_TYPE_MAP[str]
      if (!fileType) {
        let len = file.size
        let a = await this.blobToString(file.slice(0, 2))
        let b = await this.blobToString(file.slice(-2, len))
        if (a == 'FF D8' && b == 'FF D9') {
          fileType = 'jpg'
        }
      }
      return fileType
    },
    async getHW(file, fileType) {
      let height = null, width = null, reverse = false
      if (fileType === 'jpg') {
        let heightStart = parseInt('A3', 16)
        let widthStart = parseInt('A5', 16)
        console.log(heightStart, widthStart)
        height = [heightStart,heightStart+2]
        width = [widthStart,widthStart+2]
      } else if (fileType === 'png') {
        height = [22, 24]
        width = [18, 20]
      } else if (fileType === 'gif') {
        height = [8,10]
        width = [6,8]
        reverse = true
      } else {
        console.log('不合法，无法确定宽高!')
        return 
      }
      const {w,h} = await this.getRectByOffset(file, width, height, reverse)
      console.log(`${fileType}宽高为${w}, ${h}`)
    },
    async getRectByOffset(file, widthOffset, heightOffset, reverse) {
      let width = await this.blobToString(file.slice(...widthOffset))
      let height = await this.blobToString(file.slice(...heightOffset))
      if (reverse) {
        width = [width.slice(3,5),width.slice(0,2)].join(' ')
        height = [height.slice(3,5),height.slice(0,2)].join(' ')
      }
      const w = parseInt(width.replace(' ', ''), 16)
      const h = parseInt(height.replace(' ', ''), 16)
      return {w, h}
    },
    blobToString(file) {
      let reader = new FileReader()
      reader.readAsArrayBuffer(file)
      return new Promise((resolve, reject) => {
        reader.onload = function(e) {
          try {
            let arr = new Uint8Array(e.target.result)
            arr = [...arr]
            let a = arr.map(v => v.toString(16).toUpperCase().padStart(2, '0'))
              .join(' ')
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