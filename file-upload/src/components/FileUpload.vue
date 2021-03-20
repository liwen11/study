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

    // 抽样hash
    calculateHashSample() {
      return new Promise(resolve => {
        const file = this.file

        // 1.设置切片大小
        const size = this.file.size
        const offset = 1 * 1024

        // 2. 第一个和最后一个切片全部内容，其他切片的取 首中尾三个地方各2个字节

        // 首字节
        let chunks = [file.slice(0, offset)]
        //前面100k
        let cur = offset
        while(cur < size) {
          // 最后一个切片
          if (cur + offset > files.size) {
            chunks.push(cur, files.length)
          } else {
            // 中间切片 取每个切片前后两个字节及中间两个字节
            const mid = cur + offset/2
            const end = cur + offset
            chunks.push(files.slice(cur, cur + 2))
            chunks.push(files.slice(mid, mid + 2))
            chunks.push(files.slice(end - 2, end))
          }
          cur += offset
        }

        // 3.合并后的内容
        const reader = new FileReader()
        reader.readAsArrayBuffer(new Blob(chunks))

        reader.onload = e => {
          // 4.计算 md5, 这个 hash的结果，就是文件存在，有小概率误判，但是如果不存在，是100%准的的 ，
          // 和布隆过滤器的思路有些相似

          // 每个文件的md5值都是唯一的，正因为每个文件的md5是一样的，那么，我们在做文件上传的时候，
          // 就只要在前端先获取要上传的文件md5，并把文件md5传到服务器，对比之前文件的md5，
          // 如果存在相同的md5，我们只要把文件的名字传到服务器关联之前的文件即可，并不需要再次去上传相同的文件，
          // 再去耗费存储资源、上传的时间、网络带宽。
          const spark = new sparkMd5.ArrayBuffer()
          spark.append(e.target.result)
          resolve(spark.end())
        }
      })
    },
    async handleUpload() {
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