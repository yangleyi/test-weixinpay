const router = require('express').Router()
const Url = require('url')
const Order = require('../lib/order')
const fs = require('fs')
const Tools = require('../lib/tools')
const {oa} = require('../../config/config')

const db = require('../lib/db')

const path = require('path')
let htmlPath = path.join(__dirname, "../")

router.get('/', (req, res, next) => {
    let pathName = Url.parse(req.url).pathname
    console.log(`request: --> ${pathName}`.green)
    let url = Order.getCode({}) // {scope: "snsapi_userinfo"}
                
    console.log(`redirect url: ${url}`.cyan)
    res.redirect(url)
    // res.send('have redirect')
    // res.end()
})

router.get('/login', (req,res) => {
    let pathName = Url.parse(req.url).pathname
    console.log(`>>> request ${pathName} data: ${req.query}`.green)
    let url = Order.getCode({})
              
    console.log(`redirect url: ${url}`.red)
    res.redirect(url)
    // res.location(url)
    res.end(url)
})

router.get('/*.html', (req, res) => {
    // console.log('..........get', Url.parse(req.url))
    let pathName = Url.parse(req.url).pathname
    console.log(`>>> request html file: pathName -> ${pathName}`.green)
    
    fs.readFile(htmlPath+ pathName, function(err,data){
      if(err){
        console.log(`$$$ no this file ${__dirname}`)
          res.redirect(`/404.html`)
          res.end();
      }else{
          res.writeHeader(200,{
              'content-type' : 'text/html;charset="utf-8"',
              'Access-Control-Allow-Origin': '*'
          });
          res.write(data);//将.html显示在客户端
          res.end()
  
      }
    })
  })

  router.post('/getCode', (req, res) => {
    console.log('request api: ', req.body)
  
    // let data = await init()
     Order.getCode({
      "appid": oa.appid.toString(),
      "redirect_uri": "http://www.yangleyi.top/login.html"
    }).then(data => {
      // console.log('.....................>>>',data)
      res.write(data)
      // fs.writeFile('./data.html',data)
      res.end()
    })
  
    // var wxpay = WXPay({
    //   appid: 'wx019a14a6b90883e5',
    //   mch_id: '1503979901',
    //   partner_key: 'afAun6G4V1AoTdEG1BpRIx4KtjSDIOYb', //微信商户平台API密钥
    //   // pfx: fs.readFileSync('./wxpay_cert.p12'), //微信商户平台证书
    // });
    
    // wxpay.createUnifiedOrder({
    //   body: '扫码支付测试',
    //   out_trade_no: '20140703'+Math.random().toString().substr(2, 10),
    //   total_fee: 1,
    //   spbill_create_ip: '192.168.2.210',
    //   notify_url: 'https://rikpay.rikai-bots.com/payment/notify',
    //   trade_type: 'JSAPI',
    //   product_id: '1234567890'
    // }, function(err, result){
    //   console.log(result);
    // });
  
    // wxpay.getBrandWCPayRequestParams({
    //   openid: '微信用户 openid',
    //   body: '公众号支付测试',
    //     detail: '公众号支付测试',
    //   out_trade_no: '20150331'+Math.random().toString().substr(2, 10),
    //   total_fee: 1,
    //   spbill_create_ip: '192.168.2.210',
    //   notify_url: 'http://wxpay_notify_url'
    // }, function(err, result){
    //   // in express
    //     res.render('wxpay/jsapi', { payargs:result })
    // });
    
  })

  router.post('/getToken', (req, res) => { // get openid, access_token
    console.log('>>> get req.code'.green, JSON.stringify(req.body).gray)
    console.log('>>>> req.headers\n'.green, JSON.stringify(req.headers, null, 4).grey)

    // need some logic
    // let dbData = db.searchUserData
    // console.log('.............test',dbData)
    // res.send('hah')
    // res.end()
    let code = req.body.code
    if (!code) return
    let opts = {
      appid: oa.appid,
      secret: oa.secret,
      code: code
    }
    Order.getWebAccess_token(opts).then(data => { // data type is string
      data = JSON.parse(data)
      console.log('get openid and token\n'.green, JSON.stringify(data, null, 4).grey)

      
      db.searchUserData({openid: data.openid}).then(result => {
        let obj = {
            openid: data.openid,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            scope: data.scope
          }
        if (typeof result == 'string') {
          result = JSON.parse(result)
        }
        if (result && result.sign) {
          obj.sign = result.sign
        } else {
          obj.sign = Tools.getSimpleSign(data.openid)
        }
        res.send(JSON.stringify({sign: obj.sign}))
        db.saveUserData(obj)

      })
    //   information = JSON.parse(JSON.stringify(data))
    }).catch(err => {
      console.log('have problem:',err)
    })
  })

  router.post('/buy', (req, res) => {
    console.log('>>>> buy req data'.green, `${req.body}`.grey)
    db.searchUserData({},{sign: req.body.sign}).then(data => {
      console.log('have sign and can buy.'.green, typeof data)
      Order.unifiedorder(data.openid).then(result => {
        console.log('order result /n'.green,JSON.stringify(result, null, 4).grey)
        res.send(result)
      })
    })
  })
  
  router.get('/orderResult', (req, res) => {
    console.log('>>>>> order get',req.query)
  })
  
  router.get('/confirmToken', (req, res) => {
    console.log('>>> confirm token',req.query, typeof req.query)
    let token = oa.token
    let timestamp = req.query.timestamp
    let nonce = req.query.nonce
    let echostr = req.query.echostr
    let hereSign = [token, timestamp, nonce].sort().join('')
    hereSign = Tools.getSha1(hereSign)
    console.log('confirm ***** hereSign', hereSign)
    console.log('confirm wechat getSign', req.query.signature)
    if (hereSign == req.query.signature) {
      res.send(echostr+"")
      console.log('confirm success')
    } else {
      res.end(false)
    }
  })

module.exports = router