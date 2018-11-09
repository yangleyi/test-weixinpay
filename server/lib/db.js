const mongoose = require('mongoose')

let dbUrl = 'mongodb://localhost:27017/data'
var db = mongoose.createConnection(dbUrl, { useNewUrlParser: true })
db.on('error', (eror) => {
  console.log(`db connect fail: ${error}`.red)
})

db.on('open', () => {
  console.log('<-- db open success -->'.yellow)
})

// create model
let userSchema = new mongoose.Schema({
    name: String,
    openid: String,
    access_token: String,
})
// data table
let userModel = db.model('user', userSchema)

module.exports = {
    saveUserData (data) {
        // create model
        // let userSchema = new mongoose.Schema({
        //     name: String,
        //     openid: String,
        //     access_token: String,
        // })
          // data table
        // let userModel = db.model('user', userSchema)
        
          // data
        let content = {
            name: data.name || 'test',
            openid: data.openid || 'no-openid',
            access_token: data.access_token || 'no-accessToken'
        }
        let userInsert = new userModel(content)
        userInsert.save((err) => {
            if (err) {
              console.log(`save user data error: ${err}`.red)
            }else {
              console.log('save user data success...'.green)
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

        let fields = {
            name: '',
            openid: '',
            access_token: ''
        }

        // let userInsert = new userModel(content)
        userInsert.find(condit, fields, (err, data) => {
            if (err) {
                console.log(`search user data err: ${err}`.red)
            } else {
                console.log(`search data success: ${data}`.green)
            }
            db.close()
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
                console.log('modify user data success'.green)
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
                console.log('delete user data success'.green)
            }
        })
    }
}