const mongoose = require('mongoose')

let dbUrl = 'mongodb://localhost:27017/data'
mongoose.connect(dbUrl, { useNewUrlParser: true })
mongoose.connection.on('error', (error) => {
  console.log(`db connect fail: ${error}`.red)
})

mongoose.connection.on('open', () => {
  console.log('<-- db open success -->'.magenta)
})

let userSchema = new mongoose.Schema({
    openid: String,
    access_token: String,
    refresh_token: String,
    scope: String,
    sign: String
})
// data table
let userModel = mongoose.model('user', userSchema)
module.exports = {
    mongoose: mongoose,
    userModel: userModel
}

// const mongoose = require('mongoose')

// let dbUrl = 'mongodb://localhost:27017/data'
// var db = mongoose.createConnection(dbUrl, { useNewUrlParser: true })
// db.on('error', (eror) => {
//   console.log(`db connect fail: ${error}`.red)
// })

// db.on('open', () => {
//   console.log('<-- db open success -->'.magenta)
// })

// // create model
// let userSchema = new mongoose.Schema({
//     openid: String,
//     access_token: String,
//     refresh_token: String,
//     scope: String
// })
// // data table
// let userModel = db.model('user', userSchema)