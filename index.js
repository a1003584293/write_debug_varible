const _ = require('lodash');
const fs = require('fs');
const map = new Map();

map.set('text', '');
function written(){
  // for (let item of arguments) {
  //   const text = map.get('text');
  //   map.set('text', text + item);
  // }
  // 如果不安全，请使用上面的for代码
  const text = map.get('text');
  map.set('text', text + Array.prototype.join.call(arguments, ""));
}

function done(path){
  console.log(map.get('finaly'));
  written(map.get('finaly'));
  fs.writeFileSync(path, map.get('text'));
  map.delete('finaly');
  // 必须设置为空，不然连续调用内容会叠加，也不能执行map.clear()，如果连续调用，第二次text是undefined，那么写出文件开头就是undefined
  map.set('text', '');
  console.log('saved');
}

function saveVarible(path, obj = {}, key, isFinalArg) {
  if (typeof obj !== 'object' || obj == null) {
    // obj 是 null ，或者不是对象和数组，直接返回。Node.js的replaceAll只有在15.0.0才开始支持，spilit join是替代方案，且能解决兼容性问题
    // 之所以判断key-0 是不是一个整数，是因为打印数组的时候，不把下标带上，比如：[0: 'qwe']，遍历数组的时候，key就成了下标
    // obj之所以判断是不是string，是为了split不报错，确保只对字符串进行操作
    // 最后的isFinalArg 主要是看数组里是不是最后一个，最后一个不加逗号
    // 如果要替换字符串中的双引号，请加上.split(`"`).join(`\\"`)
    console.log(key - 0 >= 0 ? `` : `"${key}":`, `"${typeof obj == 'string' ? obj.split('\n').join('\\n') : obj}"`, isFinalArg ? '' : ',');
    written(key - 0 >= 0 ? `` : `"${key}":`, `"${typeof obj == 'string' ? obj.split('\n').join('\\n') : obj}"`, isFinalArg ? '' : ',');
    return obj;
  };

  // 初始化返回结果
  let result;
  if (obj instanceof Array) {
    key == undefined ? (console.log('[') , map.set('finaly', ']')) : console.log(` "${key}":[`);
    key == undefined ? (written('[') , map.set('finaly', ']')) : written(` "${key}":[`);
    result = [];
  } else {
    // 第一种是传的一个obj，第二种是数组里一个个对象[{}, {}]，那么key就是 0，1，2，3，所以左边不能打印成[0:{，最后的else是 对象中的对象 情况，例如{ address: {} }，那么就要把key打印出来
    if (key == undefined) {
      console.log('{');
      written('{')
      map.set('finaly', '}')
    } else if (key - 0 >= 0) {
      console.log('{');
      written('{')
    } else {
      console.log(` "${key}":{`)
      written(` "${key}":{`)
    }

    result = {};
  };

  const keys = Object.keys(obj)
  for (let key in obj) {
    const isFinal = keys.indexOf(key) + 1 == keys.length
    // 保证 key 不是原型的属性
    if (obj.hasOwnProperty(key)) {
      // 像第一个name和最后的beijing，既不是obj也不是arr，所以执行完saveVarible不用打印“ } ”和“ ] ”
      const current = {
        isArray: Array.isArray(obj[key]),
        isObj: typeof obj[key] == 'object' && !Array.isArray(obj[key]),
        nums: _.get(map.get(key), 'nums', 0) + 1 
      };
      map.set(key, current);
      // 递归调用。对于数组和对象，初始化的时候先打印左边，然后saveVarible打印里面的属性，打印完了，再打印闭口
      result[key] = saveVarible(null, obj[key], key, isFinal);
      if (_.get(current, 'nums', 0) >= 1) {

        if (_.get(current, 'isArray', false) && isFinal)
          console.log(']');
        else if (_.get(current, 'isArray', false) && !isFinal) 
          console.log('],');

        if (_.get(current, 'isArray', false) && isFinal)
          written(']');
        else if (_.get(current, 'isArray', false) && !isFinal) 
          written('],');

        if (_.get(current, 'isObj', false) && isFinal)
          console.log('}');
        else if (_.get(current, 'isObj', false) && !isFinal) 
          console.log('},');

        if (_.get(current, 'isObj', false) && isFinal)
          written('}');
        else if (_.get(current, 'isObj', false) && !isFinal) 
          written('},');

        current.nums - 1 == 0 ? map.delete(key) : map.set(key, { ...current, nums: current.nums - 1 });
      };
    };
  };
  map.size <= 2 && done(path)
}
exports.saveVarible = saveVarible