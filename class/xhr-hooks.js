// 你能给xhr添加hook，实现在各个阶段打日志吗？
// 1.重写属性 Object.defineproperty
// 2.重写方法 call,this指向问题

class XhrHook {
  constructor(beforeHooks = {}, afterHooks={}) {
    this.XHR = window.XMLHttpRequest
    this.beforHooks = beforeHooks
    this.afterHooks = afterHooks
    this.init()
  }
  init() {
    let _this = this
    window.XMLHttpRequest = function() {
      console.log(this)
      this._xhr = new _this.XHR()
      _this.overwrite(this)
    }
  }
  overwrite(proxyXHR) {
    for (let key in proxyXHR._xhr) {
      if (typeof proxyXHR._xhr[key] === 'function') {
        this.overwriteMethod(key, proxyXHR);
        continue
      }
      this.overwriteAttributes(key, proxyXHR)
    }
  }

  overwriteMethod(key, proxyXHR) {
    let beforHooks = this.beforHooks
    let afterHooks = this.afterHooks
    proxyXHR[key] = (...args) => {
      if (beforHooks[key]) {
        const res = beforHooks[key].call(proxyXHR, args)
        if (res === false) { // 自定义当返回为false时不执行函数
          return 
        }
      }
      const res = proxyXHR._xhr[key].apply(proxyXHR, args)
      afterHooks[key] && afterHooks[key].call(proxyXHR._xhr, res)
      return res
    }
  }
  overwriteAttributes(key, proxyXHR) {
    // console.log(this)
    Object.defineProperty(proxyXHR, key, this.property(proxyXHR, key))
  }
  property(proxyXHR, key) {
    // console.log(this)
    let obj = Object.create(null)
    let _this = this
    obj.get = function() {
      return proxyXHR['__'+key] || this._xhr(key)
    }
    obj.set = function(val) {
      console.log(this)
      if (!key.startsWith('on')) {
        proxyXHR['__'+ key] = val
        return;
      }
      if (_this.beforHooks[key]) {
        this._xhr[key] = function(...args) {
          _this.beforHooks[key].call(proxyXHR)
          val.apply(proxyXHR, args)
        }
        return 
      }
      this._xhr[key] = val
    }
    return obj
  }
}

new XhrHook({
  open: function() {
    console.log('open')
    // return false
  },
  send: function(data) {
    console.log(data)
    console.log('7777')
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

// xhr.open('GET', 'heeps://www.baidu.com', true)
// xhr.send()
xhr.onreadystatechange = function(res) {
  console.log('statechange')
}
xhr.onerror = function() {
  console.log('error')
}
