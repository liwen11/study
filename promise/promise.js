const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'


function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  if (typeof x === 'object' && x !== null || typeof x === 'function') {
    try {
      let then = x.then
      if (typeof then === 'function') {
        // 表示他是一个promise
        then.call(x, y => { // 成功回调
          resolvePromise(promise2, y, resolve, reject)
        }, z => { // 失败回调
          reject(z)
        })
      } else {
        // 表示他是一个单纯的对象 obj = {then: '1111'}
        resolve(x)
      }
    } catch (error) {
      reject(err)
    }
  } else {
    resolve(x)
  }
}

class Promise {
  constructor(executor) { // 类的构造函数，this指向实例，constructor的属性会被实例复制变成实例对象上的自身属性
    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolvedCbs = []
    this.onRejectedCbs = []
    let resolve = (value) => {
      this.value = value
      this.state = FULFILLED
      this.onResolvedCbs.forEach(cb => cb(value))
    }
    let reject = (reason) => {
      this.reason = reason
      this.state = REJECTED
      this.onRejectedCbs.forEach(cb => cb(reason))
    }
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {

    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }

    let promise2 = new Promise((resolve, reject) => {
      // 用node微任务更加贴合promise是作为微任务执行
      // 在promise回调是异步的时候(如： setTimeout 才能拿到setTimeout resolve的值， 并且才能拿到声明的promise2)
      process.nextTick(() => { 
        if (this.state === FULFILLED) {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }
        if (this.state === REJECTED) {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }
        if (this.state === PENDING) {
          this.onResolvedCbs.push(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
          this.onRejectedCbs.push(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        }
      }, 0)
    })
    return promise2
  }

  catch(fn) { // 类prototype上的方法，被实例上的_proto_所共享，实例在自身属性中找不到某个属性，就会来类的prototype上找
    return this.then(null, fn)
  }

  finally(cb) {
    let P = this.constructor
    return this.then(
      value => P.resolve(cb()).then(() => value),
      reason => P.resolve(cb()).then(() => { throw reason })
    )
  }
}
Promise.resolve = function(val) { // 类的私有属性（方法）， 只有类可以调用，实例不能调用。还可以写在类里面，前缀加 static
  return new Promise(resolve => resolve(val))
}

Promise.reject = function(val) {
  return new Promise((resolve, reject) => {reject(val)})
}

function isPromise(val) {
  if (typeof val === 'object' && val !== null || typeof val === 'function') {
    if (typeof val.then === 'function') {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

Promise.all = function(arr) {
  let a = []
  let i = 0
  function processData(i, data, resolve) {
    a[i] = data
    i++
    if (i === arr.length) {
      resolve(a)
    }
  }
  return new Promise((resolve, reject) => {
    for (let i = 0; i < arr.length; i++) {
      // 方法一：
      // if (isPromise(arr[i])) {
      //   arr[i].then(data => {
      //     processData(i, data, resolve)
      //   }, reject)
      // } else {
      //   processData(i, data, resolve)
      // }
      // 方法二： 
      Promise.resolve(arr[i]).then(data => {
        processData(i, data, resolve)
      }).catch(e => reject(e))
    }
  })
}

Promise.race = function(arr) {
  return new Promise((resolve, reject) => {
    for(let i = 0; i < arr.length; i++) {
      arr[i].then(resolve, reject)
    }
  })
}
module.exports = Promise