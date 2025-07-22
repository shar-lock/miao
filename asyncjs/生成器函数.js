
//函数声明的函数名前加*

const { reject } = require("async")
const { time } = require("console")
const { resolve } = require("path")

//关键字yield 在调用next（）方法后函数暂停的位置
function * foo(){
  yield 1
  yield 2
  yield 3
  yield 4
}
let g = foo()
g.next() //【1，false】

//可用扩展运算符和for of 遍历生成器函数里没有被执行yield语句
let a = [...g]//[1,2,3,4]
for(let x of g){
  console.log(x)
}


//可以给对象里添加一个属性[Symbol.iterator]指向一个生成器函数
//则该对象也可以被扩展运算符和for of 遍历yield语句
let obj = {
  [Symbol.iterator]:function * (){
    yield 1
    yield 2
    yield 3
    yield 4
  },
}

Number.prototype[Symbol.iterator] = function* () {
  for (let i = 0; i < this; i++) {
    yield i;
  }
};
for(var x of 20){
  console.log(x)
}



//生成器实现异步的同步写法
function getValue(val,time = 2000){
  return new Promise(resolve=>{
     setTimeout(()=>{
      resolve(val)
     },time)
  })
}

function * foo(){
  let a = yield getValue(8)
  console.log(a)
  a = yield getValue(7)
  console.log(a)
  a = yield getValue(6)
  console.log(a)
  a = yield getValue(5)
  console.log(a)
  let b = yield getValue(15)
  console.log(b)
  return a + b
}

// 以我们希望的方式执行一个总是生成promise的生成器函数：
// 每生成一个promise出来，我们就等待这个promise的结果
// 之后再回复生成器函数的执行
// 并且返回一个promise来表征这个函数的慢慢运行
// 函数运行完的时候就是返回的promise resolve的时候
function run(genfn){
  return new Promise((resolve,reject)=>{
    let generator = genfn()
    let generated = generator.next()

    step()

    function step(){
      if(generated.done){
        resolve(generated.value)
      }else{
        generated.value.then(val=>{
          generated = generator.next(val)
           step()
        },reason=>{
          generated = generator.throw(reason)
          step()
        })
      }
    }
  })
}
function run(genFn) {
  return new Promise((resolve, reject) => {
    var generator = genFn()
    try {
      var generated = generator.next()
      step()
    } catch(e) {
      reject(e)
    }

    function step() {
      if (generated.done) {
        resolve(generated.value)
      } else {
        generated.value.then(val => {
          try {
            generated = generator.next(val)
            step()
          } catch(e) {
            reject(e)
          }
        }, reason => {
          try {
            generated = generator.throw(reason)
            step()
          } catch(e) {
            reject(e)
          }
        })
      }
    }
  })
}

//异步函数
async function foo(){
  let a = await getValue(8)
  console.log(a)
  a = await getValue(7)
  console.log(a)
  a = await getValue(6)
  console.log(a)
  a = await getValue(5)
  console.log(a)
  let b = await getValue(15)
  console.log(b)
  return a + b
}

//异步生成器
async function * foo() {
  
}




//Symbol 一个symbol是一个唯一标识符，一般不参与运算
//作为对象的属性和map的kay
a = Symbol()

//代理对象 通过p(代理)来操作对象
obj = {x:1,y:2}
p = new Proxy(obj,{
  //trap
  get(target,propname){
    if(propname in target){
      return target[propname]
    }else{
      return undefined
    }
  },
  set(target,propname,value){
    if(typeof value == 'number'){
      target[propname] = value
    }
  },
  deleteProperty(target,propname){

  },
  has(target,propname){

  }
})