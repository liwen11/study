<template>
  <div>
    <input type="file" @change='handleUploadFile'>
    <button @click="handleUpload">上传</button>
  </div>
</template>

<script>
import sparkMd5 from 'spark-md5'
const CHUNK_SIZE = 1*1024 * 10 // 10KB
// jpg开头两个仕 FF D8
// 结尾两个仕 FF D9
const FILE_TYPE_MAP = {
  '89 50 4E 47': 'png',
  '47 49 46 38': 'gif',
  '52 49 46 46': 'avi'
}
export default {
  data() {
    return {
      file: null,
      hash: null
    }
  },
  methods: {
    // 生成文件块 Blob.slice语法
    createFileChunk(file, size = CHUNK_SIZE) {
      const chunks = []
      let cur = 0
      while(cur < file.size) {
        chunks.push({index: cur, file: file.slice(cur, cur+size)})
        cur += size
      }
      return chunks
    },
    calculateHashSample() {
      return new Promise(resolve => {
        const spark = new sparkMd5.ArrayBuffer()
      })
    },
    handleUpload() {
      if (!this.file) {
        console.log('请选择文件！')
        return
      }
      // 生成文件块
      let chunks = this.createFileChunk(this.file)

      // 计算hash 文件指纹标识
      this.hash = await this.calculateHashSample()
      debugger
    },
    async handleUploadFile(e) {
      let [file] = e.target.files
      if (!file) return 
      let fileType = await this.getFileType(file)
      if (fileType) {
        console.log(`当前上传文件类型为${fileType}`)
      } else {
        console.log('当前上传文件不合法')
      }
      // this.getHW(file, fileType)
      this.file = file
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