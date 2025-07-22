const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const port = 8080
const server = http.createServer()
const baseDir = 'D:/miao'
const mime = require('mime').default//第三方媒体类型库


server.on('request',(request,response)=>{
  console.log(request,request.url)
  let url = new URL(`http://a.com/${request.url}`)
  var targetPath = path.join(baseDir,decodeURIComponent(url.pathname))
 fs.stat(targetPath,(err,stat)=>{
  if(err){
    response.writeHead(404)
    response.end()
  }else{
    if(stat.isFile()){
      fs.readFile(targetPath,(err,data)=>{
         if(err){
           response.writeHead(404)
           response.end()
         }else{
           //媒体扩展名
           response.writeHead(200,{
            'content-type' : mime.getType(targetPath)
           })
           response.write(data)
           response.end()
         }
      })
    }else if(stat.isDirectory()){
      if(url.pathname.endsWith('/')){
        let indexPath = path.join(targetPath, 'index.html')
        fs.readFile(indexPath,(err,data)=>{
          if(err){
            fs.readdir(targetPath,{withFileTypes:true},(err,entries)=>{
              if(err){
                response.writeHead(500)
                response.end()
              }else{
                //对文件进行排序 文件夹在前，文件在后
                entries.sort((a,b)=>{
                  let ta = a.isFile()
                  let tb = b.isFile()
                  if(ta==tb) return 0
                  else{
                    if(ta==false){
                      return -1
                    }
                    if(tb==false){
                      return 1
                    }
                  }
                })
                response.writeHead(200,{
                  'content-type':'text/html;charset=utf8'
                })
                if(url.pathname!=='//'){
                  response.write('<div><a href = "..">..</a></div>')
                }
                response.write(`<h1>index of ${url.pathname}</h1>`)
                for(let entry of entries){
                  response.write(`<div><a href = "${entry.name}${entry.isFile() ? '':'/'}">${entry.name}${entry.isFile() ? '':'/'}</a></div>`)
                }
                response.end()
              }
            })
          }else{
            response.writeHead(200,{
              'content-type':'text/html;charset=utf8'
             })
            response.write(data)
            response.end()
          }
        })
      }else{
        response.writeHead(302,{
          location: url.pathname + '/'
        })
        response.end()
      }
    }
  }
 })
})

server.listen(port,()=>{
  console.log('listening on ' + port)
})