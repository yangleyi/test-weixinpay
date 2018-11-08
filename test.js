// var http = require('http')
// var url = require('url')

// function start () {
//     function onRequest(req, res) {
//         var pathname = url.parse(req.url).pathname
//         console.log("request for " + pathname + " received.")
//         res.writeHead(301, {"Location": 'http://www.yangleyi.top/index.html'})

//         res.end()
//     }
//     http.createServer(onRequest).listen(8888)
//     console.log("server has start")
// }

// start()

var WXPay = require('weixin-pay');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const ip = require('ip')
const Order = require('./order')
const Tools = require('./tools')
const cors = require('cors')
const {oa} = require('../config/config')
const Url = require('url')
const http = require('http')
const https = require('https')
const path = require('path')


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())



app.get('/', (req, res) => {
  console.log('>>> / ',req.params)
    res.redirect('http://www.yangleyi.top/index.html')
})


let port = 8888

app.listen(port, () => {
  console.log(`test server listening on port ${port}!`)
})



