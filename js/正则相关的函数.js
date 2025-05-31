String.prototype.match
 'adsafoodwfooasd'.match(/foo/g)  //match带g会匹配所有
 'adsadwasd'.match(/foo/) //match不带g约等价于exec方法

String.prototype.replace
String.prototype.split
  'asd-asd-asd-aad'.split('-') // ['asd','asd','asd','aad']
  'asd-asd-asd-aad'.split(/(-)/) // ['asd','-','asd','-','asd','-','aad'] 正则分组捕获的内容会出现在拆分位置上
String.prototype.search  //可以传入正则表达式

//具名捕获？<name>
'2001-12-24 12:20'.match(/(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2}) (\d{1,2}):(\d{2})/) // group = [[year:2001],[month:12],[day:24]]
// 正则标记位
// d 将分组捕获到的内容在原始字符串的位置输出到indice中
// g 全局匹配
// i 不区分大小写
// m 多行匹配
// s 点可以匹配所有符号
// y 每次匹配都要从第一次尝试匹配的位置开始匹配，可以认为正则前加了一个^ 

//前向引用
//在正则中使用\1 \2等表示该正则中第一个分组捕获的具体内容
'asd dsf qwe add cbb wee'.match(/.(.)\1/g)// [add,cbb,wee]