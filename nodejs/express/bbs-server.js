const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
const port = 8082

//设置模板文件位置
app.set('views', './templates')

const posts = [{
  id: 2,
  title: "aaa",
  content: "adadawdad",
  createdBy:"sharlock",
}]
const users = [{
  name: 'sharlock',
  password: 'we789456',
  email: "a@email.com",
  createdAt: new Date().toISOString()
}]
const comments = [{
  id:'4',
  content:'adad',
  postId:'2',
  createdBy:'sharlock',
  timeStamp:new Date().toISOString(),
  ip:'192.19.1.1',
}]


let postNum = 1
let commentid = 5
app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//解析和解密验证cookie的中间件
app.use(cookieParser('sadjkbciaha'))

//res.locals上的数据可以被所有模板访问到
app.use((req,res,next)=>{
  req.user = users.find(it=>it.name===req.signedCookies.loginUser) 
  res.locals.user = req.user
  res.locals.isLogin = !!req.user
  next()
})
//首页
app.get('/', (req, res, next) => {
  res.render('index.pug', {
    posts: posts,
  })
})

let cookieUserMap = {} //用户信息

//用户注册
app.post('/register', (req, res, next) => {
  //ajv.validate(registerSchema,req.body) 数据验证
  let registerInfo = req.body //name password
  if(registerInfo.name.length<5){
    res.type('html').end('用户名不少于5个字符')
    return 
  }
  if (registerInfo.password !== registerInfo.password1) {
    res.type('html').end('两次输入的密码不同')
    return
  }
  if (users.some(user => user.name == registerInfo.name)){
    res.type('html').end('用户名已存在')
    return
  }
  if (users.some(user => user.email == registerInfo.email)){
    res.type('html').end('email已存在')
    return
  }
  registerInfo.createdAt = new Date().toISOString()
  users.push(registerInfo)
  res.type('html').end('注册成功，前往<a href="/login.html">登录</a>')
})

//用户登录
app.post('/login',(req,res,next)=>{
  let loginInfo = req.body
  let targetuser = users.find(user=>{
    if(user.name == loginInfo.name &&user.password == loginInfo.password){
      return true
    }
  })
  if(targetuser){
    res.cookie('loginUser',targetuser.name,{
      signed:true,
      maxAge:86400 * 1000
    })
    res.redirect('/')
  }else{
    res.type('html').end('用户名或密码错误')
  }
})

app.get('/logout',(req,res,next)=>{
  res.clearCookie('loginUser')
  res.redirect('/')
})
//帖子内容
app.get('/post/:postId', (req, res, next) => {
  var postId = req.params.postId
  let post = posts.find(it => it.id == postId)
  if (post) {
    let thisComments = comments.filter(it => it.postId == postId)
    let user = users.find(it=>it.name==post.createdBy)
    res.render('post.pug', {
      post: post,
      comments: thisComments,
      Postuser:user,
    })
  } else {
    res.render('404.pug')
  }
})

//发帖
app.get('/add-post', (req, res, next) => {
  if(req.user){
    res.render('add-post.pug')
  }else{
    res.end('Please Login')
  }
})

//提交帖子
app.post('/add-post', (req, res, next) => {
  if(!req.user){
    res.end('Not Login!!')
    return 
  }
  let post = req.body //{title:'xxx',content:'xxx'}

  post.id = postNum++
  post.createdBy = req.user.name
  post.timeStamp = new Date().toISOString()
  post.ip = req.ip
  posts.push(post)

  res.redirect('/post/' + post.id)
})

//提交评论
app.post('/comment', (req, res, next) => {
  if(!req.user){
    res.end('Please Login')
    return 
  }
  let content = req.body.content
  let postId = req.body.postId
  let createdBy = req.user.name
  let commentObj = {
    id: commentid++,
    content,
    postId,
    createdBy,
    timeStamp: new Date().toISOString(),
    ip: req.ip,
  }
  comments.push(commentObj)
  res.redirect('/post/' + postId)
})

//删除评论
app.post('/delete-comment/:commentId',(req,res,next)=>{
  let idx = comments.findIndex(it=>it.id==req.params.commentId)
  if(idx>=0){
    comments.splice(idx,1)
  }
  res.redirect(req.get('referer'))
})

app.listen(port, () => {
  console.log('listening on port: ', port)
})

