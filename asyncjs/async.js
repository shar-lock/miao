
function asyncMap(arr,asyncMapper,cb){
  let result = []
  let count = 0
  if(arr.length == 0){
    cb(null,result)
  }
  for(let i = 0;i<arr.length;i++){
    asyncMapper(arr[i],(err,res)=>{
      result[i] = res
      count++
      if(count==arr.length){
        cb(null,result)
      }
    })
  }
}
function asyncSquare(a, cb) {
  setTimeout(() => {
    cb(null, a * a)
  }, 50 + Math.random() * 10)
}


var a = [1,2,3,4,5,6,7,8]

asyncMap(a, asyncSquare, (err, result) => {
  console.log(result)
  // [1,4,9,16,25,36,49,64]
})


function series(tasks,alldone){
  let i = 0
  function done1(){
    if(i == tasks.length - 1){
      alldone()
    }else{
      tasks[i++](done1)
    }
  }
  if(tasks.length == 0){
    alldone
  }else{
    tasks[0](done1)
  }
}
series([(done) => {
  console.log('start...')
  setTimeout(() => {
      console.log('end.....')
      done()
  }, 1000)

}, (done) => {

  console.log('start...')
  setTimeout(() => {
      console.log('end.....')
      done()
  }, 1000)

},(done) => {

  console.log('start...')
  setTimeout(() => {
      console.log('end.....')
      done()
  }, 1000)

}],  ()=>{

  console.log('okkkkkkkkkk')
  
})


class TaskQueue{
  constructor(){
    this._tasks = []
    this.running = false
  }
  _nextTask(){
    let task
    if(this._tasks.length>0){
      task = this._tasks.shift()
      task(()=>{
        this._nextTask()
      })
    }else{
      this.running = false
    }
  }
  addTask(task){
    if(this.running){
      this._tasks.push(task)
    }else{
      this.running = true
      task(()=>{
        this._nextTask()
      })
    }
  }
}


//并行任务
class paralleTaskQueue{
  constructor(paralleLimit){
    this._tasks = []
    this.runningCnt = 0
    this._paralleLimit = paralleLimit
  }
  _nextTask(){
    let task
    if(this._tasks.length>0){
      task = this._tasks.shift()
      task(()=>{
        this._nextTask()
      })
    }else{
      this.runningCnt-- 
    }
  }
  addTask(task){
    if(this.runningCnt==this._paralleLimit){
      this._tasks.push(task)
    }else{
      this.runningCnt++
      task(()=>{
        this._nextTask()
      })
    }
  }
}