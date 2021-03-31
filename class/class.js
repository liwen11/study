class A {
}

class B extends A {
}

let a = new A()
let b = new B()
console.log(a.__proto__ === A.prototype)
console.log(A.prototype.constructor === A)

console.log(Object.getPrototypeOf(B) === A)
console.log(B.__proto__ === A) // true
console.log(B.prototype.__proto__ === A.prototype) // true

console.log(b.__proto__.__proto__ === a.__proto__)