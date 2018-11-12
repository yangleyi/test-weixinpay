const mongoose = require('mongoose')

let dbUrl = 'mongodb://localhost:27017/data'
mongoose.connect(dbUrl, { useNewUrlParser: true })
mongoose.connection.on('error', (eror) => {
  console.log(`db connect fail: ${error}`.red)
})

mongoose.connection.on('open', () => {
  console.log('<-- db open success -->'.magenta)
})

let userSchema = new mongoose.Schema({
    openid: String,
    access_token: String,
    refresh_token: String,
    scope: String
})
// data table
let userModel = mongoose.model('user', userSchema)
module.exports = {
    mongoose: mongoose,
    userModel: userModel
}