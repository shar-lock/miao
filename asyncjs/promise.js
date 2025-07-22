const { json } = require("stream/consumers")


const p = new Promise((resolve,reject)=>{
  resolve()
  reject(new Error())
})

p3 = p.then((value)=>{
  return 2
},(reason)=>{
  return 5
})//成功与否，取决于返回值

p4 = p.then(v=>{
  return 'foo'
},r =>{
  prmpt()//函数失败抛出错误
  return 2
})

p5 = p.then(()=>{
  throw 2 //失败抛出错误
},(reason)=>{
  return 9 
})

p6 = p.then((val)=>{
  return p7 //p6取决于p7的状态
},(reason)=>{
  throw 'fail'
})



function resolve(val){
  const p = new Promise((rs)=>{
    rs(val)
  })
  return p
}
function reject(resaon){
  const p = new Promise((rs,rj)=>{
    rj(resaon)
  })
  return p
}
//接收若干个promise对象，返回一个promise对象，
// 最终resolve出若干个promise对象结果组成的数组
//有一个失败返回失败
function all(promises){
  return new Promise((resolve,reject)=>{
    let res = []
    let cnt = 0
    if(promises.length==0){
      resolve(res)
    }
    for(let i = 0;i<promises.length;i++){
      Promise.resolve(promises[i]).then(val=>{
        res[i] = val
        cnt++
        if(cnt==promises.length){
          resolve(res)
        }
      },reason=>{
        reject(reason)
      })
    }
  })
}

//返回一个promise对象，其结果为参数中最先得到结果的promise对象
function race(promises){
  return new Promise((resolve,reject)=>{
    for(let i = 0;i<promises.length;i++){
      Promise.resolve(promises[i]).then(val=>{
        resolve(val)
      },reason=>{
        reject(reason)
      })
    }
  })
}

//有一个成功就成功，全失败才失败
function any(promises){
  return new Promise((resolve,reject)=>{
    let cnt = 0
    for(let i = 0;i<promises.length;i++){
      Promise.resolve(promises[i]).then(val=>{
        resolve(val)
      },reason=>{
        cnt++
        if(cnt===promises.length) reject(reason)
      })
    }
  })
}


//等待所有promise都完成，并且把每个结果收集在一个数组中
//数组里为一个对象，一个对象表示一个promise的结果
//{status: fulfilled/rejected ,val:,reason:}
function allSettled(promises){
 return new Promise((resolve,reject)=>{
  let res = []
  for(let i = 0;i<promises.length;i++){
    let obj = {}
    Promise.resolve(promises[i]).then(val=>{
      obj['status'] = 'fulfilled'
      obj['val'] = val
    },reason=>{
      obj['status'] = 'rejected'
      obj['reason'] = reason
    })
    res[i] = obj
  }
  resolve(res) 
 })
}

Promise.prototype.finally = function(f){
  return this.then(val=>{
    return Promise.resolve(f()).then(()=>val)
  },reason=>{
    return Promise.resolve(f()).then(()=>{throw reason})
  })
}


//try
function promiseTry(f,...args){
  return new Promise((resolve,reject)=>{
    resolve(f())
  })
}

//withResolvers
function promiseWithResolvers(){
  return {
    promise: new Promise((resolve,reject)=>{
      this.resolve = resolve
      this.reject = reject
    }),
    resolve:function(){

    },
    reject:function(){

    }
  }
}
