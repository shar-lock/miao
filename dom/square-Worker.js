globalThis.addEventListener("message",function(e){
  let data = e.data
  let res = data * data

  this.postMessage(res)
})