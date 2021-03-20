const Promise = require('./promise')
// const Promise = require('./promise2')

// const promise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     if (false){
//       resolve('1111');
//     } else {
//       reject('错误');
//     }
//   }, 0)
// });
// setTimeout(() => {
//   console.log('8888')
// }, 0)
// promise.then().then(data => {
//   debugger
//   console.log('suc:'+data)
// }, (err) => {
//   console.log('err:' +err)
// })

// promise.catch((err) => {
//   debugger
//   console.log('err:' +err)
//   return '111'
// }).then(data => {
//   console.log(data)
// })
// let thenable = {
//   then: function(resolve, reject) {
//     resolve(42);
//   }
// };
// let thenable = new Promise((resolve, reject) => {
//   resolve(4)
// })
// Promise.resolve(4).then(data => {
//   console.log(data)
// })
// console.log(thenable)
// promise.reject(22).catch(data => {
//   console.log(data)
// })

// class Foo {
//   static a = 1
//   b = 2
//   static classMethod() {
//    console.log(1111)
//   }
// }


// Foo.classMethod = function() {
//   console.log('555')
// }
// Foo.a = 1

// var foo = new Foo();
// Foo.classMethod()
// console.log(foo.a)
// console.log(foo.b)

// new Promise((resolve, reject) => {
//   resolve(222)
// }).then(data => {
//   console.log(data)
// }).finally(() => {
//   console.log('fff')
// })
// let arr = [1, 3, 5]
// Promise.all(arr).then(data => {
//   console.log(data)
// })

// let p = new Promise((resolve, reject) => {
//   resolve(1000)
// })
// p.finally(() => {
//   console.log('dddd')
// })
let P1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(100)
  }, 1000)
})

let P2 = new Promise((resolve, reject) => {
  resolve(200)
})
let arr = [P1, P2]
Promise.race(arr).then(data => {
  console.log(data)
})