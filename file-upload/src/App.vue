<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <FileUpload/> -->
    <test></test>
  </div>
</template>

<script>
// import FileUpload from './components/FileUpload.vue'
import test from './components/test.vue'
export default {
  name: 'App',
  components: {
    // FileUpload,
    test
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
