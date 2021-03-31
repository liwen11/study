// 你能给xhr添加hook，实现在各个阶段打日志吗？
// 1.重写属性 Object.defineproperty
// 2.重写方法 call,this指向问题

class XhrHook {

}

new XhrHook({
  open: function() {
    console.log('open')
    // return false
  },
  onload: function() {
    console.log('onload')
  },
  onreadystatechange: function() {
    console.log('change')
  },
  onerror: function() {
    console.log('hook error')
  },
})

var xhr = new XMLHttpRequest()

xhr.open('GET', 'heeps://www.baidu.com', true)
xhr.send()
xhr.onreadystatechange = function(res) {
  console.log('statechange')
}
xhr.onerror = function() {
  console.log('error')
}
