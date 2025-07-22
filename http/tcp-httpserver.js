const net = require('net')

const port = 8085

const server = net.createServer(socket=>{
  socket.on('data',data=>{
    let lines = data.toString().split('\r\n')
    let firstline = lines.shift()
    let [method,url] = firstline.split(' ')
    console.log(method,url)
    socket.write('HTTP/1.1 200 OK\r\n')
    socket.write(`Date: ${new Date()}\r\n`)
    socket.write('Content-Type: text/html; charset=UTF-8\r\n')
    // socket.write('Content-Length: 20\r\n')
    socket.write('\r\n')
    socket.write('<h1>adadadadada</h1>' + new Date())
    
  })
  socket.on('error',()=>{
    socket.end()
  })
})

server.listen(port,()=>{
  console.log('server listening on port',port)
})