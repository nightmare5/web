 const fp = require('lodash/fp');
/**
 * 
 * const fp = require('lodash/fp');
//数据
//horsepower 马力，dollar_value 价格，in_stock 库存
 
 */
const cars = [
  {
    name:'Ferrari FF', horsepower:660,dollar_value:70000,in_stock:true
  },
  {
    name:'Soyker C12 Zagato', horsepower:650,dollar_value:648000,in_stock:false
  },
  {
    name:'Jaguar XKR-S', horsepower:550,dollar_value:132000,in_stock:false
  },
  {
    name:'Audi R8', horsepower:525,dollar_value:114200,in_stock:false
  },
  {
    name:'Aston Martin One-77', horsepower:750,dollar_value:1850000,in_stock:true
  },
  {
    name:'Pagani Huayra', horsepower:700,dollar_value:1300000,in_stock:false
  },
]
//1,使用函数组合fp.flowRight()重新实现下面这个函数
/**
 * let isLastInStock = function (cars) {
   //获取最后一条数据
   let last_car = fp.last(cars)
   //获取最后一条数据的in_stock属性值
   return fp.prop('in_stock',last_car)
 }
 */
// const prop = fp.curry((str,value) => {
//     return fp.prop(str,value)
// })
const a = fp.flowRight(fp.prop('in_stock'), fp.last);
console.log('',a(cars));
//2,使用fp.flowRight()、fp.prop()和fp.first()获取第一个car的name
// const first = fp.curry((str) => {
//   return fp.first(str)
// })
// // console.log('',fp.first(cars));
// console.log('',r);
const b = fp.flowRight(fp.prop('name'), fp.first)
console.log('',b(cars));
//3，使用帮助函数_average重构averageDollarValue,使用函数组合的方式实现
// let _average = function (xs) {
//   return fp.reduce(fp.add,0,xs)
// }
// let averageDollarValue = function (cars) {
//   let dollar_values = fp.map(function (car) {
//     return car.dollar_value
//   }, cars)
//     return _average(dollar_values)
// }
let _average = function (xs) {
  return fp.reduce(fp.add,0,xs)
}
let c = fp.flowRight(_average,fp.map('dollar_value'));
console.log('',c(cars));
//4,使用flowRight写一个sanitizeNames()函数，返回一个下划线链接的小写字符串，把数组中的name转换为这种形式：如
//  sanitizeNames(["Hello World"])=>["hello_world"]
let _underscore = fp.replace(/\W+/g, '_')
let map = fp.curry((str,value) => {
  return fp.map(str,value)
})
let d = fp.flowRight(map(_underscore),map(fp.toLower),map('name'));
console.log('',d(cars));