const crypto = require('crypto')
const xml2js = require('xml2js')
const shortid = require('shortid')
module.exports = {
	getSimpleSign (openid) {
		let times = new Date().getTime()
		return this.getMd5(openid + times)
	},

    getMd5 (str) {
		if (typeof str !== "string") {
			console.error('getMd5 argument must be a string: ', str)
			return
		}
		return crypto.createHash('md5').update(str).digest('hex')
	},

	getSha1 (str) {
		if (typeof str !== "string") {
			console.error('getSha1 argument must be a string: ', str)
			return
		}
		return crypto.createHash("sha1").update(str).digest("hex")
	},

	ascllSort (obj) {
		if (obj === null || typeof obj !== "object") {
			console.error('ascllSort argument must be a object')
			return
		}
		let keys = Object.keys(obj).sort()
		console.log('sort res: ', keys)
		let str = ''
		for (var key of keys) {
		  let val = obj[key]
		  str += `${key}=${val}&`
		}
		return str.slice(0, -1)
    },
    
    objBuildXml (obj) {
        if (obj === null || typeof obj !== 'object') {
            console.warn('parameter must be object! -> {}')
            return
        }
        let builder = new xml2js.Builder()
        return builder.buildObject(obj)
    },

    xmlBuildObj (xml) {
        xml2js.parseString(xml, function (err, result) {
            if (err) console.error('build xml fail:', err)
            return result
        });
	},
	
	nonce_str () {
		return shortid.generate()
	},
}