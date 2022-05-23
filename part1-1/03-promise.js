//尽可能还原Promise中的每一个API，并通过注释的方式描述思路和原理
/**
 * 1,promise是一个类，传入一个执行器，执行器会立即执行
 * 2，promise有三中状态，成功failed，失败rejected，等待pending
 *    pending => fulfilled
 *    pending => rejected
 *    状态一旦确认就不能再进行更改
 * 3,resolve和rejected是用来定义成功和失败的
 *    resolve => fulfilled
 *    rejected => rejected
 *    
 */
const myPromise = require('./MaPromise')
const promise = new myPromise((resolve, reject) => {
  // setTimeout(() => {
  //   resolve('成功')
  // }, 2000);
  // resolve('成功')
  reject('失败')
})
function p1 () {
  return new myPromise(function (resolve, reject) {
    setTimeout(function () {
      resolve('p1')
    }, 2000)
  })
}
function p2 () {
  return new myPromise(function (resolve, reject) {
    reject('失败')
    // resolve('成功');  
  })
}
// promise.then((resolve) => {
//   console.log('', resolve);
//   return p2();
// }, reject => {
//   console.log('',reject);
// }).then((res) => {
//   console.log('',res);
// })
// promise.then().then().then((res) => {
//   console.log('',res);
// })
// myPromise.all(['a','b',p1(),p2(),'c']).then((res) => {
//   console.log('',res);
// })
promise.then((res) => {
  console.log('',res);
}).catch((err) => {
  console.log('',err);
})