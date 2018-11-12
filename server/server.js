var WXPay = require('weixin-pay');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const colors = require('colors')
const router = require('./router/router')

console.log('rainbow'.rainbow)
console.log('grey'.grey)
console.log('gray'.gray)
console.log('cyan'.cyan)
console.log('green'.green)
console.log('yellow'.yellow)
console.log('blue'.blue)
console.log('red'.red)
console.log('magenta'.magenta)
console.log('blue'.blue)


// colors.setTheme({
//   silly: 'rainbow',
//   input: 'grey',
//   verbose: 'cyan',
//   prompt: 'grey',
//   info: 'green',
//   data: 'grey',
//   help: 'cyan',
//   warn: 'yellow',
//   debug: 'blue',
//   error: 'red'
// })

let information = {}

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())
app.use(router)
// console.log('.............................',router)

let port = 80

// http.createServer(app).listen(port, () => {
//   console.log(`test server listening on port ${port}!`)
// })
// var privateKey  = fs.readFileSync(path.join(__dirname, './cert-1541125308192_www.yangleyi.top.key'), 'utf8');
// var certificate = fs.readFileSync(path.join(__dirname, './cert-1541125308192_www.yangleyi.top.crt'), 'utf8');
// var options = {key: privateKey, cert: certificate};

// https.createServer(options, app).listen(port, () => {
//   console.log(`test server listening on port ${port}!`)
// })

app.listen(port, () => {
  console.log(`test server listening on port ${port}!`)
})



