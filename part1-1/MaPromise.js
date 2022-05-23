//3，定义成功，失败，等待的全局变量
const PENDING = 'pending'//等待
const FULFILLED = 'fulfilled'//成功
const REJECTED = 'rejected'//失败
//1，定义一个promise类
class MyPromise{
  constructor(success) {
    try {
      //因为是定义再类里面的函数，所以要用this来进行获取
      success(this.resolve,this.reject)
    } catch (e) {
      this.reject(e)
    };
  };
  //4，定义一个初始的状态值
  statice = PENDING;
  //7，定义一个用来存放成功值得变量
  values = undefined;
  //7，定义一个用来存放失败原因得变量
  reasons = undefined;
  //9,定义成功回调
  successCallback = [];
  //9，定义失败回调
  failCallback = [];
  //2,成功
  resolve = (success) => {
    //5,因为状态值一旦确定就不能再更改，所以要对状态值进行判断
    if (this.statice !== PENDING) return;
    //6,把成功的状态保存起来
    this.statice = FULFILLED;
    //8,把成功得值保存起来
    this.values = success;
    //10,判断成功回调里面有没有值,如果有值就把成功得值传递进去
    // if (this.successCallback) return this.successCallback(this.values);
    //11,循环遍历成功得回调，拿取到每一个值后把成功得值传递进去
    while (this.successCallback.length) this.successCallback.shift()();
  }
  //2，失败
  reject = (success) => {
    //5,因为状态值一旦确定就不能再更改，所以要对状态值进行判断
    if (this.statice !== PENDING) return;
    //6,把失败的状态保存起来
    this.statice = REJECTED;
    //8,把失败得原因保存起来
    this.reasons = success;
    //10,判断失败回调里面有没有值,如果有值就把失败得原因传递进去
    // if (this.failCallback) return this.failCallback(this.reasons);
     //11,循环遍历成功得回调，拿取到每一个值后把成功得值传递进去
    while (this.failCallback.length) this.failCallback.shift()();
  }
  //定义then方法，then方法是定义再原型对象上的
  then(successCallback, failCallback) {
    //13，把then方法得参数变成可选参数
    successCallback = successCallback ? successCallback : value => value;
    failCallback = failCallback ? failCallback : reason => { throw reason };
    //12,then方法得链式调用会返回一个promise对象
    let promise2 = new MyPromise((resolve,reject) => {
      //7,判断保存下来的状态值
      if (this.statice === FULFILLED) {
        //成功-->把成功得回调保存到一个变量里面
        setTimeout(() => {
          try {
              let x = successCallback(this.values);
              /**
               * 判断x得值是普通值还是promise
               * 如果是普通值就直接返回
               * 如果是promise，就查看promise得状态
               * 再根据promise得状态再决定是调用resolve或reject
               * 如果链式调用返回得是自己本身，就抛出一个错误
               * 但是这里我们是获取不到自身得，因为代码是同步代码，代码要运行完毕才能获取到自身函数，所以要把代码改成异步代码
               */
              resolvePromise(promise2,x,resolve,reject)
          } catch (e) {
            reject(e)
          }
        },0)
      } else if (this.statice === REJECTED) {
        setTimeout(() => {
          try {
            //失败--把成功得回调保存到一个变量里面
              let x = failCallback(this.reasons)
              /**
               * 判断x得值是普通值还是promise
               * 如果是普通值就直接返回
               * 如果是promise，就查看promise得状态
               * 再根据promise得状态再决定是调用resolve或reject
               * 如果链式调用返回得是自己本身，就抛出一个错误
               * 但是这里我们是获取不到自身得，因为代码是同步代码，代码要运行完毕才能获取到自身函数，所以要把代码改成异步代码
               */
              resolvePromise(promise2,x,resolve,reject)
          } catch (e) {
            reject(e)
          }
        },0)
      } else {//有异步代码，状态为等待
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
                let x = successCallback(this.values);
                /**
                 * 判断x得值是普通值还是promise
                 * 如果是普通值就直接返回
                 * 如果是promise，就查看promise得状态
                 * 再根据promise得状态再决定是调用resolve或reject
                 * 如果链式调用返回得是自己本身，就抛出一个错误
                 * 但是这里我们是获取不到自身得，因为代码是同步代码，代码要运行完毕才能获取到自身函数，所以要把代码改成异步代码
                 */
                resolvePromise(promise2,x,resolve,reject)
            } catch (e) {
              reject(e)
            }
          },0)
        });
        this.failCallback.push(() => {
            setTimeout(() => {
              try {
                //失败--把成功得回调保存到一个变量里面
                  let x = failCallback(this.reasons)
                  /**
                   * 判断x得值是普通值还是promise
                   * 如果是普通值就直接返回
                   * 如果是promise，就查看promise得状态
                   * 再根据promise得状态再决定是调用resolve或reject
                   * 如果链式调用返回得是自己本身，就抛出一个错误
                   * 但是这里我们是获取不到自身得，因为代码是同步代码，代码要运行完毕才能获取到自身函数，所以要把代码改成异步代码
                   */
                  resolvePromise(promise2,x,resolve,reject)
              } catch (e) {
                reject(e)
              }
            },0)
        });
      }
    })
    return promise2;
  }
  //finally方法是定义再原型对象上的
  finally(success) {
    return this.then((value) => {
       return  MyPromise.resolve(success()).then( () => value)
    },(reject) => {
      return MyPromise.resolve(success()).then(()=>{throw reject})
    })
  }
  //catch
  catch(success) {
      return this.then(undefined,success)
  }
  //all是一个静态方法，要使用static关键字
  static all(array) {
    //14,定义一个用来存放数组得变量
    let statices = [];
    //17,定义一个数值
    let index = 0;
    //15,all方法返回得是一个promise对象
    return new MyPromise((resolve, reject) => {
      function resoleData(key,value){
        statices[key] = value;
        index++;
        //判断，只有当代码全部执行完毕了之后才能进行返回
        if (index === array.length) {
          resolve(statices)
        }
      }
      //16,循环遍历传递过来得值
      for (let i = 0; i < array.length; i++){
        //把每一个值保存再变量里面
        let success = array[i];
        //判断这个变量得数据类型
        if (success instanceof MyPromise) {
          //promsie对象
          success.then(value => resoleData(i,value),reason => reject(reason))
        } else {
          //普通值
          resoleData(i,array[i])
        }
      }
    })
    
  }
  //resolve是静态方法，必须执行成功和失败
  static resolve(success) {
      //判断传递的值是否是promise对象，如果是就直接返回
    if (success instanceof MyPromise) return success;
    return new MyPromise(value => value(success))
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if (x instanceof MyPromise) {
    //promise
    x.then(resolve,reject)
  } else {
    //普通值
    resolve(x)
  }
}
module.exports = MyPromise;