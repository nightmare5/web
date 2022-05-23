const fp = require('lodash/fp');
const { Maybe, Container } = require('./support')
//1,使用fp.add(x,y)和fp.map(f,x)创建一个能让functor里的值增加的函数ex1
let maybe = Maybe.of([5, 6, 1]);
let ex1 = (e) => {
    return maybe.map(fp.map(a => fp.add(a,x)))
}
console.log('',ex1(2));
//2，实现一个函数ex2，能够使用fp.first获取列表的第一个元素
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
let ex2 = (value) => {
    return fp.first(value)
}
console.log('',ex2(xs._value));
//3,实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母
let safeProp = fp.curry(function (x,o) {
    return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }
let ex3 = (str,value) => {
  return fp.first(safeProp(str,value)._value)
}
console.log('',ex3('name',user));
//4,使用Maybe重写ex4，不要有if语句
let ex4 = function (n) {
  return Maybe.of(n).map(x => parseInt(x))
}
console.log('456qqq');