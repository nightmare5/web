//创建一个observer类
class Observer{
  constructor(data) {
    this.walk(data);
  }
  walk(data) {
    //1,判断data是否是对象
    if (!data || typeof data !== 'object') return; 
    //2，遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    })
  }
  defineReactive(obj, key, val) {
    let _this = this;
    //负责收集依赖，并发送通知
    let dep = new Dep();
    //如果val是对象，就把这个对象转换成响应式
    this.walk(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        //搜集依赖
        Dep.target && dep.addSub(Dep.target)
        return val; 
      },
      set(newValue) {
        if (newValue == val) return;
        val = newValue;
        _this.walk(val);
        //发送通知
        dep.notify()
      }
    })
  }
}