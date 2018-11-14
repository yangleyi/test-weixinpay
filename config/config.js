module.exports = {
    partnerKey: '', // 支付安全密钥
    orderApi: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    options: {
        mch_id: '',
        notify_url: '',
        trade_type: 'JSAPI'
    },
    oa: {
        // "appid": "",// my
        "appid": "", //test
        "secret": "", //test
        // "appid": '', // tutorbot
        // "secret": "", //tutorbot
        "token": "weixin",
        "redirect": "",
        "authorize": "https://open.weixin.qq.com/connect/oauth2/authorize"
    }
}