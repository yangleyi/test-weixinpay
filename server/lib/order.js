'use strict'
const request = require('request')
const urlencode = require('urlencode')
const ip = require('ip')
const config = require('../../config/config')
const Tools = require('../lib/tools')
const moment = require('moment')

const Order = {

	getCode (obj) {
		let oa = config.oa
		let url = oa.authorize
		// let uri = urlencode(obj.redirect_uri)
		let uri = urlencode(oa.redirect)
		// let uri = oa.redirect
		// console.log('redirect_uri:', uri)
		var optStr = `appid=${oa.appid}&redirect_uri=${uri}&response_type=code&scope=${obj.scope || "snsapi_base"}&state=123#wechat_redirect`
		// console.log(`getcode request url: ${url}?${optStr}`)
		return `${url}?${optStr}`
		// return new Promise((resolve, reject) => {
		// 	request({
		// 		url: `${url}?${optStr}`,
		// 		method: 'GET'
		// 	}, (err, res, data) => {
		// 		if (err) {
		// 			console.log('get code error: ', err)
		// 			reject(err)
		// 		}
		// 		console.log('get code :', data)
		// 		resolve(data)
		// 	})
		// })
	},

	/**
	 * get access_token api will return this data
	 * {"access_token":"ACCESS_TOKEN",
		"expires_in":7200,
		"refresh_token":"REFRESH_TOKEN",
		"openid":"OPENID",
		"scope":"SCOPE" 
		}
	 */
	getWebAccess_token (obj) {
		// let url = "https://api.weixin.qq.com/sns/oauth2/access_token"
		// let opt = {
		// 	"appid": `${obj.appid}`,
		// 	"secret": `${obj.secret}`,
		// 	"code": obj.code.toString(),
		// 	"grant_type": "authorization_code"
		// }
		let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${obj.appid}&secret=${obj.secret}&code=${obj.code}&grant_type=authorization_code`
		return new Promise((resolve, reject) => {
			request({
				url: url,
				// data: opt,
				// json: true,
				method: 'get'
			}, (err, res, data) => {
				if (err) {
					console.log('get web access_token err: '.red, err)
					reject(err)
				}
				resolve(data)
			})
		})
	},

	getWebRefresh_token (obj) {
		let url = "https://api.weixin.qq.com/sns/oauth2/refresh_token"
		let opt = {
			"appid": obj.appid.toString(),
			"grant_type": "refresh_token",
			"refresh_token": obj.refresh_token.toString()
		}
		return new Promise((resolve, reject) => {
			request({
				url: url,
				data: opt,
				json: true,
				method: "GET"
			}, (err, res, data) => {
				if (err) {
					console.log('get web refresh_token err: ', err)
					reject(err)
				}
				console.log('get web refresh_token: ', data)
				resolve(data)
			})
		})
	},

	getWebUserinfo (obj) {
		let url = "https://api.weixin.qq.com/sns/userinfo"
		let opt = {
			"access_token": obj.access_token.toString(),
			"openid": obj.openid.toString(),
			"lang": obj.lang.toString() || "zh_CN"
		}
		return new Promise((resolve, reject) => {
			request({
				url: url,
				data: opt,
				json: true,
				method: 'GET'
			}, (err, res, data) => {
				if (err) {
					console.log('get userinfo err:', err)
					reject(err)
				}
				console.log('get userinfo: ',data)
				resolve(data)
			})
		})
	},

	unifiedorder (openid) {
		return new Promise((resolve, reject) => {
		  let oa = config.oa
		  let obj = {
			appid: oa.appid,
			nonce_str: Tools.nonce_str(),
			body: '商品名称',
			total_fee: 1,
			spbill_create_ip: ip.address(),
			out_trade_no: `order_${(new Date).getTime()}`,
			openid: openid
		  }
		  Object.assign(obj, config.options)
		  let str = Tools.ascllSort(obj)
		  str = `${str}&key=${config.partnerKey}`
		  console.log('this string will signature /n'.green, str.grey)
		  let sign = Tools.getMd5(str).toUpperCase()
		  Object.assign(obj, {sign})
		  console.log('>>>>>>>>>>>>>sign',sign)
		  let options = Tools.objBuildXml(obj)
		  console.log('order request data:\n'.green, `${options}`.grey)
		  console.log('test time function...'.cyan,new Date().getTime(), moment().unix())
	
		  request({
			url: config.orderApi,
			method: 'POST',
			body: options
		  }, (err, res, body) => {
			if (err) {
			  console.log('order request error ', err)
			  reject(err)
			}
			if (!err && res.statusCode == 200) {
			  // let data = this.signAgain(body)
				let data = this.signAgain(body)
				resolve(data)
			} 
			// console.log('........ request res',res)
			// console.log('........ request body',body)
		  })
		})
	},
	  
  	async signAgain (xml) {
		// let xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true})
		// console.log('>>> signagain xml\n'.green, xml.grey)
		let data = await Tools.xmlBuildObj(xml)
		data = data.xml
		if (data.return_code.toUpperCase() == "FAIL") {
			console.log('cant go on...'.red)
			return data
		}
		let obj = {
			appId: data.appid,
			timeStamp: moment().unix(),
			nonceStr: Tools.nonce_str(),
			package: `prepay_id=${data.prepay_id}`,
			signType: 'MD5'
		}
		let str = this.ascllSort(obj)
		str = `${str}key=${config.partnerKey}`
		let paySign = crypto.createHash('md5').update(str).digest('hex').toUpperCase()
		Object.assign(obj, {paySign})
		return obj
	},
}

module.exports = Order