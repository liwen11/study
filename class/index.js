function Person(name, age) {
  this.name = name
  this.age = age
  this.say = function() {
    console.log('say')
  }
}

Person.prototype.hello = function() {
  console.log('hello')
}

let person = new Person('33', 13)

// console.log(Person.prototype)
// console.log(person.__proto__.__proto__.__proto__ === null)
// protytype: 原型对象
// _proto_:实例通过这个属性来访问原型对象 person._proto_ = Person.protytype
// constructor: Person.protytype.constructor = Person


function Dog(name, age) {
  // Person.call(this, name, age)
}
Dog.prototype.dog = function() {
  console.log('555')
}
// js实现类的继承方式1： 需要手动修改子函数原型对象的继承及原型对象的构造函数constructor指向
// 缺点：因为对象都是指针，修改原型对象的构造函数后会修改父级的构造函数指向
// Dog.prototype = Person.prototype
// Dog.prototype.constructor = Dog

// js实现类的继承方式2：充分利用原型链，改变Dog的原型对象的__proto__指向Person.prototype
// 缺点：__proto__是浏览器实现的属性，并没有在js规范里面，且改变了Dog__proto__原本的指向(Object.prototype)
// Dog.prototype.__proto__ = Person.prototype

// js实现类的继承方式3：利用中间构造函数

// function Temp() {
//   // this.name='aaaa'
// }
// Temp.prototype = Person.prototype
// Dog.prototype = new Temp()
// Temp.prototype.constructor = Dog


function extend(Child, Parent) {

　var F = function(){};

　F.prototype = Parent.prototype;

　Child.prototype = new F();

　Child.prototype.constructor = Child;

　Child.uber = Parent.prototype;

}
// js封装公用的继承函数
// function inherit(target, origin) {
//   let Fn = function() {}
//   Fn.prototype = origin.prototype
//   var fn = new Fn()
  
//   target.prototype = fn
//   fn.constructor = target
// }
// function inherit(target, origin) {
//   let Fn = function() {}
//   Fn.prototype = origin.prototype
//   target.prototype = new Fn()
//   // fn.constructor = target
//   target.prototype.constructor = target
// }
extend(Dog, Person)
// console.log(Temp.prototype)
console.log(Person.prototype)
console.log(Dog.prototype)
let dog = new Dog('44', 14)
console.log(dog)
// dog.say()
// dog.hello() 