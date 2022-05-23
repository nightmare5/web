/**
 * setTimeout(function() {
  var a = 'hello'
  setTimeout(function () {
    var b = 'lagou'
    setTimeout(function () {
      var c = 'I * U'
      console.log('',a+b+c);
    })
  },10)
 }, 10);
 使用promise方法
 */
const promise = new Promise((resole,reject) => {
  resole('hello')
});
promise.then((resole) => {
  return resole + 'loagou'
}).then((resole) => {
  console.log('',resole + 'I * U');
})