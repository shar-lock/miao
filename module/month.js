
let monthes = ['January','Febauary','March','April','May','June','July','Auguest','Septempber','Oct','November','December']

/*export*/ function name(num){
  return monthes[num]
}
/*export*/ function number(name){
  return monthes.indexOf(name)
}

//commonJs 写法
exports.name = name
exports.number = number