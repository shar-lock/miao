class EventEmitter{
  constructor(){
    this.event = new Map()
  }
  on(eventName,handle){
    if(!this.event.has(eventName)){
      this.event.set(eventName,new Array())
    }
    this.event.get(eventName).push(handle)
  }
  emit(eventName,...args){
    if(this.event.has(eventName)){
      for(let fn of this.event.get(eventName)){
        fn(...args)
      }
    }
  } 
}