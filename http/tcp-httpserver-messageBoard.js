const net = require('net')

const port = 8085

const messages = []
const server = net.createServer(socket=>{
  socket.on('data',data=>{
    let lines = data.toString().split('\r\n')
    let firstline = lines.shift()
    let [method,url] = firstline.split(' ')
    console.log(method,url)
    console.log(data.toString())

    if(url=='/message-board'){
      socket.write('HTTP/1.1 200 OK\r\n')
      socket.write(`Date: ${new Date().toISOString()}\r\n`)
      socket.write('Content-Type: text/html; charset=UTF-8\r\n')
      // socket.write('Content-Length: 20\r\n')
      socket.write('\r\n')
      socket.write(`
        <form method="GET" action="/leave-message">
          <p>Name: <input type="text" name="name"></p>
          <p>Message:<br><textarea name="message"></textarea></p>
          <p><button type="submit">Send</button></p>
        </form>
      `)
      for(let m of messages){
        socket.write(`
          <fieldset>
          <legend>${m.name}</legend>
          ${m.message}
          </fieldset>
        `)
      }
      socket.end()
    }else if(url.startsWith('/leave-message')){
      let [path,query] =  url.split('?')
      let msg = parseQuery(query)
      
      messages.push(msg)

      socket.write('HTTP/1.1 302 Found\r\n')//状态码301 302都是跳转的专用状态码 
      socket.write(`Date: ${new Date().toISOString()}\r\n`)
      socket.write('Location: /message-board\r\n')//表示让浏览器跳转到某个地址
      socket.write('Content-Type: text/html; charset=UTF-8\r\n')
      socket.write('\r\n')
      socket.end()
    }else{
      socket.write('HTTP/1.1 200 OK\r\n')
      socket.write(`Date: ${new Date().toISOString()}\r\n`)
      socket.write('Content-Type: text/html; charset=UTF-8\r\n')
      // socket.write('Content-Length: 20\r\n')
      socket.write('\r\n')
      socket.write('<h1>it works</h1>' + new Date())
      socket.end()
    }
    
  })
  socket.on('error',()=>{
    socket.end()
  })
})

server.listen(port,()=>{
  console.log('server listening on port',port)
})


//将一个形如A=xxx&B=xxx&...转化成一个对象
function parseQuery(query){
 let obj = {}
 let keyVal = query.split('&')
 for(const str of keyVal){
  let [key,val] = str.split('=')
  obj[key] = decodeURIComponent(val)
 }
 return obj
}