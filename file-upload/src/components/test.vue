<template>
  <div class="file-upload-wrap">
    <div class="file-item-wrap">
      <!-- <img class="icon-camara" src="../assets/img/camara.svg" /> -->
      <!-- <img
        v-show="isShow"
        class="icon-close"
        @click="deletePreview"
        src="../assets/img/close.svg"
      /> -->
      <p class="des">请选择身份证正面照片或者拍照上传</p>
      <!-- 上传预览 -->
      <img class="preview" v-show="isShow" :src="imgSrc" />
      <input
        class="inp"
        type="file"
        ref="inp"
        @click="clearInp"
        @change="showPreview"
      />
    </div>
    <button @click="upload">上传</button>
  </div>
</template>

<script>
export default {
   data() {
        return {
          imgSrc: '',
          fileObj: {}
        }
      },
      computed: {
        isShow() {
          return !!this.imgSrc
        }
      },
      methods: {
        //本地预览
        showPreview() {
          const vm = this
          this.fileObj = vm.$refs.inp.files[0]
          if (!window.FileReader) return
          const reader = new FileReader()
          reader.readAsDataURL(vm.fileObj)
          reader.onloadend = function() {
            // 此时this 指向fileRender
            const that = this
            vm.$nextTick(() => {
              vm.imgSrc = that.result
            })
          }
        },
    
        upload() {
          // 校验文件格式
          this.checkType(this.fileObj)
          // 校验大小
          this.checkSize(this.fileObj)
          // 上传
          this.uplodHandler(this.fileObj)
        },
        // 转换图片为二进制类型
        dataURLtoBlob() {
          const vm = this
          vm.hexStr = ''
          let dataViewObj = {}
          if (!window.FileReader) return
          const reader = new FileReader()
          reader.readAsArrayBuffer(vm.fileObj)
          reader.onloadend = function() {
            const that = this
            vm.$nextTick(() => {
              dataViewObj = new DataView(that.result)
              for (let i = 0; i < dataViewObj.byteLength; i++) {
                vm.hexStr += dataViewObj.getUint8(i).toString(16)
              }
              // 校验文件格式
              vm.checkType(vm.hexStr)
            })
          }
        },
        // 校验图片类型
        checkType(hexStr) {
          console.log(hexStr)
          const mimeTypeList = [{ typeName: 'jpg/jpeg', hexStr: 'FFD8FF' }, { typeName: 'png', hexStr: '89504E47' }]
          // 依据二进制文件头信息来做判断，防止修改扩展名
          const jpegHex = hexStr.slice(0, 6).toUpperCase()
          const pngHex = hexStr.slice(0, 8).toUpperCase()
          const matchTypeList = mimeTypeList.filter((item) => item.hexStr === jpegHex || item.hexStr === pngHex)
          if (!matchTypeList.length) {
            this.$dialog.alert({
              title: '温馨提示',
              message: '请上传格式为png，jpg 或jpeg的照片格式'
            })
            return false
          }
    
          /* // 获取文件name
          const name = fileObj.name
          // 文件扩展名
          const ext = name.split('.')[1].toLowerCase()
          // 允许上传的格式
          const imgType = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG']
          const filterType = imgType.filter((item) => item === ext)
          if (!filterType.length) {
            this.$dialog.alert({
              title: '温馨提示',
              message: '请上传格式为png，jpg 或jpeg的照片格式'
            })
            return false
          } */
        },
        // 校验大小
        checkSize(fileObj) {
          if (fileObj.size >= 10 * 1024) {
            this.$dialog.alert({
              title: '温馨提示',
              message: '照片大小不能超过10k'
            })
            return false
          }
        },
        // 上传
        uplodHandler() {
          // TODO 上传接口
          // axios.post(...)
          
        },
        // 清除input值
        clearInp() {
          this.$refs.inp.value = ''
        },
        // 删除重新上传
        deletePreview() {
          this.imgSrc = ''
          this.$refs.inp.value = ''
        }
      }
}
</script>

<style>
</style>