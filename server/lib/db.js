const mongoose = require('mongoose')

let dbUrl = 'mongodb://localhost:27017/data'
var db = mongoose.createConnection(dbUrl, { useNewUrlParser: true })
db.on('error', (eror) => {
  console.log(`db connect fail: ${error}`.red)
})

db.on('open', () => {
  console.log('<-- db open success -->'.magenta)
})

// create model
let userSchema = new mongoose.Schema({
    openid: String,
    access_token: String,
    refresh_token: String,
    scope: String
})
// data table
let userModel = db.model('user', userSchema)

module.exports = {
    async saveUserData (data) {
        // create model
        // let userSchema = new mongoose.Schema({
        //     name: String,
        //     openid: String,
        //     access_token: String,
        // })
          // data table
        // let userModel = db.model('user', userSchema)

        let saved = await this.searchUserData(data)
        if (saved) {
            console.log('this data has saved.'.magenta)
            return
        }
        
          // data
        let content = {
            openid: data.openid || 'no-openid',
            access_token: data.access_token || 'no-accessToken',
            refresh_token: data.refresh_token || 'no-refreshToken',
            scope: data.scope || 'no-scope'
        }
        console.log('will save this data:\n'.magenta, JSON.stringify(content, null, 4).grey)
        let userInsert = new userModel(content)
        userInsert.save((err) => {
            if (err) {
              console.log(`save user data error: ${err}`.red)
            }else {
              console.log('save user data success...'.magenta)
            }
            db.close()
        })
    },

    searchUserData (data) {
        // let userSchema = new mongoose.Schema({
        //     name: String,
        //     openid: String,
        //     access_token: String,
        // })
        // let userModel = db.model('user', userSchema)

        // search condition
        var condit = {openid: data.openid}
        return new Promise((resolve, reject) => {
            userModel.findOne(condit, (err, data) => {
                if (err) {
                    console.log(`search user data err: ${err}`.red)
                    reject(err)
                } else {
                    console.log('search data success:\n'.magenta, `${data}`.grey)
                    resolve(data)
                }
                // db.close()
            })
        })
    },

    modifyUserData (data) {
        // let userSchema = new mongoose.Schema({
        //     name: String,
        //     openid: String,
        //     access_token: String,
        // })
        // let userModel = db.model('user', userSchema)
        let condit = {openid: data.openid}

        // change the data
        let content = {
            name: data.name || 'changed name'
        }
        let userInsert = new userModel(content)
        userInsert.update(condit, content, err => {
            if (err) {
                console.log(`modify user data err: ${err}`.red)
            } else {
                console.log('modify user data success'.magenta)
            }
            db.close()
        })
    },

    deleteUserData (data) {
        let condit = {openid: data.openid}
        let userInsert = new userModel(content)
        userInsert.update(condit, err => {
            if (err) {
                console.log(`delete user data err: ${err}`.red)
            } else {
                console.log('delete user data success'.magenta)
            }
        })
    }
}