// 一、将下面异步代码使用 Promise 的方式改进
// setTimeout(function () {
//   var a = "hello";
//   setTimeout(function () {
//     var b = "lagou";
//     setTimeout(function () {
//       var c = "I ❤ U";
//       console.log(a + b + c);
//     }, 10);
//   }, 10);
// }, 10);

var fn1 = function () {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      var a = "hello";
      setTimeout(function () {
        var b = "lagou";
        setTimeout(function () {
          var c = "I ❤ U";
          resolve(a + b + c);
        }, 10);
      }, 10);
    }, 10);
  })
}
fn1().then(res => {
  console.log(res)
})

// 二、基于以下代码完成下面的四个练习
const fp = require('lodash/fp')
const cars = [
  { name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true },
  { name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false },
  { name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
  { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
  { name: 'Aston Martin One-77', horsepower: 750, dollar_value: 1800000, in_stock: true },
  { name: 'Pagani Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false }
]

// 练习1 使用函数组合 fp.flowRight() 重新实现下面这个函数
// let isLastInStock = function(cars){
//   let last_car = fp.last(cars)
//   return fp.prop('in_stock', last_car)
// }

let isLastInStock = function (cars) {
  let f = fp.flowRight(fp.prop('in_stock'), fp.last)
  return f(cars)
}
console.log(isLastInStock(cars))


// 练习2：使用 fp.flowRight()、fp.prop()和fp.first()获取第一个car的name

let firstCarName = function (cars) {
  let f = fp.flowRight(fp.prop('name'), fp.first)
  return f(cars)
}
console.log(firstCarName(cars))


// 练习3：使用帮助函数 _average 重构 averageDollarValue，使用函数组合的方式实现
let _average = function (xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length
}
// let averageDollarValue = function (cars) {
//   let dollar_values = fp.map(function (car) {
//     return car.dollar_value
//   }, cars)
//   return _average(dollar_values)
// }

let getDollarValue = cars => {
  return fp.map(car => car.dollar_value, cars)
}
let averageDollarValue = function (cars) {
  let f = fp.flowRight(_average, getDollarValue)
  return f(cars)
}
console.log(averageDollarValue(cars))


// 练习4：使用 flowRight 写一个 sanitizeNames() 函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式，
// 例如：sanitizeNames(["Hello World"]) => ["hello_world"]

let _underscore = fp.replace(/\W+/g, '_')

let sanitizeNames = function (cars) {
  let f = fp.flowRight(_underscore, fp.toLower)
  return fp.map(car => { car.name = f(car.name); return car }, cars)
}
console.log(sanitizeNames(cars))


// 三、基于以下代码完成下面的四个练习

// 练习1：使用 fp.add(x,y)和fp.map(f,x)创建一个能让functor里的值增加的函数ex1

const { Maybe, Container } = require('./support')

let maybe = Maybe.of([5, 6, 1])
let ex1 = () => {
  return maybe.map(value=>{
    return fp.map(v=>{
      return fp.add(v,1)
    },value)
  })
}
console.log(ex1()._value)

// 练习2：实现一个函数ex2，能够使用fp.first获取列表的第一个元素

let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
// console.log(xs)
let ex2 = () => {
  return xs.map(value => fp.first(value))
}
console.log(ex2()._value)

// 练习3：实现一个函数ex3，使用 safeProp 和 fp.first 找到 user 的名字的首字母

let safeProp = fp.curry(function(x,o){
  return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }
let ex3 = ()=>{
  return safeProp('name',user).map(v => {
    return fp.first(v)
  })
}
console.log(ex3(user)._value)

// 练习4：使用 Maybe 重写 ex4，不用有 if 语句
// let ex4 = function(n){
//   if(n){
//     return parseInt(n)
//   }
// }

let ex4 = function(n){
  let x = Maybe.of(n)
  return x.map(v => {
    return parseInt(n)
  })
}