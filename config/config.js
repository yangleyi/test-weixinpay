module.exports = {
    partnerKey: 'afAun6G4V1AoTdEG1BpRIx4KtjSDIOYb', // 支付安全密钥
    orderApi: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    options: {
        // appid: 'wx019a14a6b90883e5', // tutorbot
        appid: 'wxf176386df8ef3ff6', // test
        mch_id: '1503979901',
        notify_url: 'https://rikpay.rikai-bots.com/payment/notify',
        trade_type: 'JSAPI'
    },
    oa: {
        // "appid": "wx721a6734e15aa572",// my
        "appid": "wxf176386df8ef3ff6",
        "secret": "4d6f8d0ddf3f8633da4dea6fba39bebb",
        "token": "weixin",
        "redirect": "http://www.yangleyi.top/login.html",
        "authorize": "https://open.weixin.qq.com/connect/oauth2/authorize"
    }
}